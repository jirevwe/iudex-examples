import { describe, test, expect } from 'iudex';

describe('Standard Library - Validators', { prefix: 'stdlib.validators' }, () => {
  test('should validate email addresses', async ({ std }) => {
    expect(std.validate.isEmail('test@example.com')).toBe(true);
    expect(std.validate.isEmail('user+tag@domain.co.uk')).toBe(true);
    expect(std.validate.isEmail('invalid')).toBe(false);
    expect(std.validate.isEmail('test@')).toBe(false);
    expect(std.validate.isEmail('@example.com')).toBe(false);
  }, { id: 'validate_email' });

  test('should validate URLs', async ({ std }) => {
    expect(std.validate.isURL('https://example.com')).toBe(true);
    expect(std.validate.isURL('http://localhost:3000')).toBe(true);
    expect(std.validate.isURL('ftp://example.com')).toBe(false);
    expect(std.validate.isURL('not-a-url')).toBe(false);
  }, { id: 'validate_url' });

  test('should validate UUIDs', async ({ std }) => {
    expect(std.validate.isUUID('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
    expect(std.validate.isUUID('not-a-uuid')).toBe(false);
    expect(std.validate.isUUID('123e4567-e89b-12d3')).toBe(false);

    // Test with generated UUID
    const uuid = std.crypto.uuid();
    expect(std.validate.isUUID(uuid)).toBe(true);
  }, { id: 'validate_uuid' });

  test('should validate IP addresses', async ({ std }) => {
    expect(std.validate.isIPv4('192.168.1.1')).toBe(true);
    expect(std.validate.isIPv4('255.255.255.255')).toBe(true);
    expect(std.validate.isIPv4('256.1.1.1')).toBe(false);
    expect(std.validate.isIPv4('not-an-ip')).toBe(false);

    expect(std.validate.isIP('192.168.1.1')).toBe(true);
    expect(std.validate.isIP('2001:0db8:85a3::8a2e:0370:7334')).toBe(true);
  }, { id: 'validate_ip' });

  test('should validate JSON strings', async ({ std }) => {
    expect(std.validate.isJSON('{"key": "value"}')).toBe(true);
    expect(std.validate.isJSON('[1, 2, 3]')).toBe(true);
    expect(std.validate.isJSON('not json')).toBe(false);
    expect(std.validate.isJSON('{key: value}')).toBe(false);
  }, { id: 'validate_json' });

  test('should validate base64 strings', async ({ std }) => {
    const encoded = std.encode.base64('hello');
    expect(std.validate.isBase64(encoded)).toBe(true);
    expect(std.validate.isBase64('SGVsbG8=')).toBe(true);
    expect(std.validate.isBase64('not-base64!@#')).toBe(false);
  }, { id: 'validate_base64' });

  test('should validate date formats', async ({ std }) => {
    expect(std.validate.isDate('2024-01-15')).toBe(true);
    expect(std.validate.isDate('2024-01-15T10:30:00Z')).toBe(true);
    expect(std.validate.isDate('invalid-date')).toBe(false);
  }, { id: 'validate_date' });

  test('should validate phone numbers', async ({ std }) => {
    expect(std.validate.isPhone('+1-555-123-4567')).toBe(true);
    expect(std.validate.isPhone('555-123-4567')).toBe(true);
    expect(std.validate.isPhone('(555) 123-4567')).toBe(true);
    expect(std.validate.isPhone('abc')).toBe(false);
  }, { id: 'validate_phone' });

  test('should validate hex strings', async ({ std }) => {
    expect(std.validate.isHex('deadbeef')).toBe(true);
    expect(std.validate.isHex('123ABC')).toBe(true);
    expect(std.validate.isHex('not-hex')).toBe(false);

    const hash = std.crypto.sha256('test');
    expect(std.validate.isHex(hash)).toBe(true);
  }, { id: 'validate_hex' });

  test('should validate alphanumeric strings', async ({ std }) => {
    expect(std.validate.isAlphanumeric('abc123')).toBe(true);
    expect(std.validate.isAlphanumeric('ABC')).toBe(true);
    expect(std.validate.isAlphanumeric('123')).toBe(true);
    expect(std.validate.isAlphanumeric('abc-123')).toBe(false);
    expect(std.validate.isAlphanumeric('abc 123')).toBe(false);
  }, { id: 'validate_alphanumeric' });

  test('should validate using regex patterns', async ({ std }) => {
    expect(std.validate.matches('hello123', /^[a-z]+\d+$/)).toBe(true);
    expect(std.validate.matches('test@example.com', /^[\w.]+@[\w.]+$/)).toBe(true);
    expect(std.validate.matches('abc', /^\d+$/)).toBe(false);
  }, { id: 'validate_regex' });

  test('should check if values are empty', async ({ std }) => {
    expect(std.validate.isEmpty(null)).toBe(true);
    expect(std.validate.isEmpty(undefined)).toBe(true);
    expect(std.validate.isEmpty('')).toBe(true);
    expect(std.validate.isEmpty('   ')).toBe(true);
    expect(std.validate.isEmpty([])).toBe(true);
    expect(std.validate.isEmpty({})).toBe(true);
    expect(std.validate.isEmpty('hello')).toBe(false);
    expect(std.validate.isEmpty([1])).toBe(false);
  }, { id: 'validate_empty' });

  test('should validate type checks', async ({ std }) => {
    expect(std.validate.isNumber(42)).toBe(true);
    expect(std.validate.isNumber('42')).toBe(false);
    expect(std.validate.isInteger(42)).toBe(true);
    expect(std.validate.isInteger(42.5)).toBe(false);
    expect(std.validate.isBoolean(true)).toBe(true);
    expect(std.validate.isString('hello')).toBe(true);
    expect(std.validate.isArray([1, 2])).toBe(true);
    expect(std.validate.isObject({a: 1})).toBe(true);
  }, { id: 'validate_types' });

  test('should validate string length', async ({ std }) => {
    expect(std.validate.isLength('hello', 5)).toBe(true);
    expect(std.validate.isLength('hello', 3, 10)).toBe(true);
    expect(std.validate.isLength('hello', 10)).toBe(false);
  }, { id: 'validate_length' });

  test('should validate number ranges', async ({ std }) => {
    expect(std.validate.isInRange(5, 1, 10)).toBe(true);
    expect(std.validate.isInRange(0, 1, 10)).toBe(false);
    expect(std.validate.isInRange(15, 1, 10)).toBe(false);
  }, { id: 'validate_range' });

  test('should validate JSON schema', async ({ std }) => {
    const schema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'number', minimum: 0 }
      },
      required: ['name', 'age']
    };

    const validData = { name: 'John', age: 30 };
    const result1 = std.validate.schema(validData, schema);
    expect(result1.valid).toBe(true);
    expect(result1.errors).toHaveLength(0);

    const invalidData = { name: 'John' }; // Missing age
    const result2 = std.validate.schema(invalidData, schema);
    expect(result2.valid).toBe(false);
    expect(result2.errors.length).toBeGreaterThan(0);
  }, { id: 'validate_schema' });

  test('should validate API response data', async ({ std, request }) => {
    const response = await request.get('https://httpbin.org/get');
    expect(response).toHaveStatus(200);

    // Validate response structure
    expect(std.validate.isObject(response.body)).toBe(true);
    expect(std.validate.isString(response.body.url)).toBe(true);
    expect(std.validate.isURL(response.body.url)).toBe(true);
  }, { id: 'validate_api_response' });

  test('should validate user input before API request', async ({ std, request }) => {
    const userEmail = 'test@example.com';

    if (!std.validate.isEmail(userEmail)) {
      throw new Error('Invalid email format');
    }

    const response = await request.post('https://httpbin.org/post', {
      email: userEmail
    });

    expect(response).toHaveStatus(200);
    expect(response.body.json.email).toBe(userEmail);
  }, { id: 'validate_before_request' });
});
