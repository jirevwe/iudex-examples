import { describe, test, expect } from 'iudex';

describe('Standard Library - Encoding', { prefix: 'stdlib.encoding' }, () => {
  test('should encode and decode base64', async ({ std }) => {
    const original = 'Hello, Iudex!';
    const encoded = std.encode.base64(original);
    expect(encoded).toBe('SGVsbG8sIEl1ZGV4IQ==');

    const decoded = std.decode.base64(encoded);
    expect(decoded).toBe(original);
  }, { id: 'base64_roundtrip' });

  test('should handle URL encoding for query params', async ({ std }) => {
    const param = 'hello world & special=chars';
    const encoded = std.encode.url(param);
    expect(encoded).toContain('%20');

    const decoded = std.decode.url(encoded);
    expect(decoded).toBe(param);
  }, { id: 'url_encoding' });

  test('should safely parse JSON with error handling', async ({ std }) => {
    const obj = { status: 'ok', data: [1, 2, 3] };
    const json = std.encode.json(obj);
    const parsed = std.decode.json(json);

    expect(parsed).toHaveProperty('status');
    expect(parsed.data).toHaveLength(3);
  }, { id: 'json_roundtrip' });

  test('should use base64 encoding in HTTP request', async ({ std, request }) => {
    const credentials = 'testuser:testpass';
    const encoded = std.encode.base64(credentials);
    const authHeader = `Basic ${encoded}`;

    const response = await request.get('https://httpbin.org/headers', {
      headers: { 'Authorization': authHeader }
    });

    expect(response).toHaveStatus(200);
    // Verify the encoding worked correctly
    expect(encoded).toBe('dGVzdHVzZXI6dGVzdHBhc3M=');
    expect(std.decode.base64(encoded)).toBe(credentials);
  }, { id: 'base64_auth_header' });

  test('should encode complex object to JSON for API request', async ({ std, request }) => {
    const payload = {
      user: {
        name: 'Test User',
        email: 'test@example.com'
      },
      metadata: {
        source: 'api-test',
        timestamp: Date.now()
      }
    };

    // Test JSON encoding
    const jsonString = std.encode.json(payload);
    expect(std.validate.isJSON(jsonString)).toBe(true);

    const decoded = std.decode.json(jsonString);
    expect(decoded.user.name).toBe('Test User');

    const response = await request.post('https://httpbin.org/post', payload);
    expect(response).toHaveStatus(200);
  }, { id: 'json_api_payload' });
});
