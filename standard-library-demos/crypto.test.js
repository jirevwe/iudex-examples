import { describe, test, expect } from 'iudex';

describe('Standard Library - Crypto', { prefix: 'stdlib.crypto' }, () => {
  test('should generate SHA256 hash', async ({ std }) => {
    const hash = std.crypto.sha256('hello');
    expect(hash).toMatch(/^[a-f0-9]{64}$/); // 64 hex chars

    // Hash should be deterministic
    const hash2 = std.crypto.sha256('hello');
    expect(hash).toBe(hash2);
  }, { id: 'sha256_hash' });

  test('should generate different hashes for different inputs', async ({ std }) => {
    const hash1 = std.crypto.sha256('hello');
    const hash2 = std.crypto.sha256('world');

    expect(hash1).not.toBe(hash2);
  }, { id: 'sha256_different_inputs' });

  test('should generate HMAC signature', async ({ std }) => {
    const message = 'sensitive data';
    const secret = 'my-secret-key';
    const hmac = std.crypto.hmacSHA256(message, secret);

    expect(hmac).toMatch(/^[a-f0-9]{64}$/);

    // HMAC should be deterministic
    const hmac2 = std.crypto.hmacSHA256(message, secret);
    expect(hmac).toBe(hmac2);

    // Different key should produce different HMAC
    const hmac3 = std.crypto.hmacSHA256(message, 'different-key');
    expect(hmac).not.toBe(hmac3);
  }, { id: 'hmac_signature' });

  test('should generate unique UUIDs', async ({ std }) => {
    const uuid1 = std.crypto.uuid();
    const uuid2 = std.crypto.uuid();

    expect(uuid1).toMatch(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/);
    expect(uuid1).not.toBe(uuid2); // Must be unique
  }, { id: 'uuid_generation' });

  test('should use UUID in API request header', async ({ std, request }) => {
    const requestId = std.crypto.uuid();

    // Verify UUID format
    expect(std.validate.isUUID(requestId)).toBe(true);

    const response = await request.get('https://httpbin.org/get', {
      headers: { 'X-Request-ID': requestId }
    });

    expect(response).toHaveStatus(200);
  }, { id: 'uuid_in_request' });

  test('should generate webhook signature for API call', async ({ std, request }) => {
    const payload = {
      event: 'user.created',
      userId: 12345
    };

    const secret = 'webhook-secret-key';
    const payloadString = std.encode.json(payload);
    const signature = std.crypto.hmacSHA256(payloadString, secret);

    // Verify signature is a valid hex string
    expect(std.validate.isHex(signature)).toBe(true);
    expect(signature).toMatch(/^[a-f0-9]{64}$/);

    const response = await request.post('https://httpbin.org/post', payload, {
      headers: {
        'X-Webhook-Signature': signature
      }
    });

    expect(response).toHaveStatus(200);
  }, { id: 'webhook_signature' });

  test('should hash password before sending to API', async ({ std, request }) => {
    const password = 'my-secure-password';
    const hashedPassword = std.crypto.sha256(password);

    // Verify hash properties
    expect(std.validate.isHex(hashedPassword)).toBe(true);
    expect(hashedPassword).toMatch(/^[a-f0-9]{64}$/);
    // Hash should not contain original password
    expect(hashedPassword.includes(password)).toBe(false);

    const user = {
      username: 'testuser',
      passwordHash: hashedPassword
    };

    const response = await request.post('https://httpbin.org/post', user);
    expect(response).toHaveStatus(200);
  }, { id: 'password_hashing' });

  test('should generate random bytes', async ({ std }) => {
    const bytes = std.crypto.randomBytes(16);
    expect(bytes).toMatch(/^[a-f0-9]{32}$/); // 16 bytes = 32 hex chars

    const bytes2 = std.crypto.randomBytes(16);
    expect(bytes).not.toBe(bytes2); // Should be random
  }, { id: 'random_bytes' });

  test('should support multiple hash algorithms', async ({ std }) => {
    const input = 'test data';

    const md5 = std.crypto.md5(input);
    const sha1 = std.crypto.sha1(input);
    const sha256 = std.crypto.sha256(input);
    const sha512 = std.crypto.sha512(input);

    expect(md5).toMatch(/^[a-f0-9]{32}$/);
    expect(sha1).toMatch(/^[a-f0-9]{40}$/);
    expect(sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(sha512).toMatch(/^[a-f0-9]{128}$/);

    // All should be different
    expect(md5).not.toBe(sha1);
    expect(sha1).not.toBe(sha256);
    expect(sha256).not.toBe(sha512);
  }, { id: 'multiple_hash_algorithms' });
});
