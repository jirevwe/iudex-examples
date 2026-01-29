import { describe, test, expect } from 'iudex';

describe('Real-world API Testing with std', { prefix: 'stdlib.comprehensive' }, () => {
  test('should authenticate and make signed request', async ({ std, request }) => {
    // Generate test credentials
    const username = std.random.username();
    const password = std.random.password(16);

    // Create authentication header
    const credentials = `${username}:${password}`;
    const encoded = std.encode.base64(credentials);
    const authHeader = `Basic ${encoded}`;

    // Verify encoding worked
    expect(std.validate.isBase64(encoded)).toBe(true);
    expect(std.decode.base64(encoded)).toBe(credentials);

    // Make authenticated request
    const response = await request.get('https://httpbin.org/headers', {
      headers: { 'Authorization': authHeader }
    });

    expect(response).toHaveStatus(200);
  }, { id: 'auth_flow' });

  test('should generate and verify webhook signature', async ({ std, request }) => {
    const payload = {
      event: 'user.created',
      timestamp: std.datetime.nowISO(),
      data: {
        id: std.random.int(1, 1000),
        email: std.random.email(),
        name: std.random.fullName()
      }
    };

    // Validate generated data
    expect(std.validate.isDate(payload.timestamp)).toBe(true);
    expect(std.validate.isEmail(payload.data.email)).toBe(true);

    // Create webhook signature
    const secret = 'webhook-secret-key';
    const payloadString = std.encode.json(payload);
    const signature = std.crypto.hmacSHA256(payloadString, secret);

    // Verify signature format
    expect(std.validate.isHex(signature)).toBe(true);
    expect(signature).toMatch(/^[a-f0-9]{64}$/);

    // Send webhook
    const response = await request.post('https://httpbin.org/post', payload, {
      headers: {
        'X-Webhook-Signature': signature,
        'X-Timestamp': payload.timestamp
      }
    });

    expect(response).toHaveStatus(200);
  }, { id: 'webhook_signature' });

  test('should create user with validated data', async ({ std, request }) => {
    // Generate realistic user data
    const user = {
      id: std.crypto.uuid(),
      firstName: std.random.firstName(),
      lastName: std.random.lastName(),
      email: std.random.email(),
      username: std.string.snakeCase(std.random.username()),
      createdAt: std.datetime.nowISO(),
      profile: {
        phone: std.random.phoneNumber(),
        address: {
          city: std.random.city(),
          country: std.random.country()
        }
      }
    };

    // Validate data before sending
    expect(std.validate.isUUID(user.id)).toBe(true);
    expect(std.validate.isEmail(user.email)).toBe(true);
    expect(std.validate.isDate(user.createdAt)).toBe(true);
    expect(user.username).toMatch(/^[a-z0-9_]+$/);

    // Send to API
    const response = await request.post('https://httpbin.org/post', user);
    expect(response).toHaveStatus(200);
  }, { id: 'create_validated_user' });

  test('should handle date-based filtering', async ({ std, request }) => {
    // Get date range for last 30 days
    const endDate = new Date();
    const startDate = std.datetime.subtract(endDate, 30, 'days');

    // Format dates for API
    const params = {
      start: std.datetime.format(startDate, 'YYYY-MM-DD'),
      end: std.datetime.format(endDate, 'YYYY-MM-DD'),
      timezone: 'UTC'
    };

    // Verify dates are valid
    expect(std.validate.isDate(params.start)).toBe(true);
    expect(std.datetime.isBefore(startDate, endDate)).toBe(true);

    const response = await request.get('https://httpbin.org/get', { params });
    expect(response).toHaveStatus(200);
  }, { id: 'date_filtering' });

  test('should sanitize and transform API response', async ({ std }) => {
    const apiResponse = {
      data: {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'secret123',
        internalId: 'xyz-internal'
      },
      metadata: {
        timestamp: std.datetime.nowISO(),
        requestId: std.crypto.uuid()
      }
    };

    // Remove sensitive fields
    const sanitized = std.object.omit(apiResponse.data, ['password', 'internalId']);
    expect(std.object.has(sanitized, 'password')).toBe(false);
    expect(std.object.has(sanitized, 'internalId')).toBe(false);
    expect(std.object.has(sanitized, 'name')).toBe(true);

    // Transform keys to camelCase
    const publicData = std.object.pick(sanitized, ['id', 'name', 'email']);
    expect(std.object.keys(publicData)).toHaveLength(3);
  }, { id: 'transform_response' });

  test('should batch process with random test data', async ({ std, request }) => {
    // Generate batch of test users
    const users = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      email: std.random.email(),
      name: std.random.fullName(),
      role: std.random.arrayElement(['admin', 'user', 'guest'])
    }));

    // Group by role
    const grouped = std.array.groupBy(users, 'role');

    // Sort by name
    const sorted = std.array.sortBy(users, 'name');

    expect(users).toHaveLength(5);
    expect(sorted[0].name).toBeDefined();
    expect(std.object.keys(grouped).length).toBeGreaterThan(0);

    // Send batch request
    const response = await request.post('https://httpbin.org/post', {
      users: sorted,
      total: users.length
    });

    expect(response).toHaveStatus(200);
  }, { id: 'batch_processing' });

  test('should generate secure token with expiry', async ({ std, request }) => {
    const now = std.datetime.now();
    const expiresAt = std.datetime.add(new Date(now), 1, 'hour');

    const tokenData = {
      userId: std.random.int(1, 10000),
      sessionId: std.crypto.uuid(),
      issuedAt: now,
      expiresAt: std.datetime.toUnix(expiresAt),
      permissions: ['read', 'write']
    };

    // Verify token data
    expect(std.validate.isUUID(tokenData.sessionId)).toBe(true);
    expect(tokenData.expiresAt).toBeGreaterThan(Math.floor(now / 1000));

    // Create token signature
    const tokenString = std.encode.json(tokenData);
    const signature = std.crypto.hmacSHA256(tokenString, 'secret-key');
    const token = std.encode.base64(`${tokenString}.${signature}`);

    // Verify token is valid
    expect(std.validate.isBase64(token)).toBe(true);

    // Use token in request
    const response = await request.get('https://httpbin.org/bearer', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    expect(response).toHaveStatus(200);
  }, { id: 'secure_token' });

  test('should handle pagination with statistics', async ({ std }) => {
    const pageSize = 10;

    // Generate mock items
    const items = Array.from({ length: pageSize }, (_, i) => ({
      id: std.crypto.uuid(),
      value: std.random.float(0, 100, 2)
    }));

    // Calculate statistics
    const values = std.array.map(items, 'value');
    const stats = {
      total: items.length,
      sum: std.array.sum(values),
      mean: std.array.mean(values),
      min: std.array.min(values),
      max: std.array.max(values)
    };

    // Verify statistics
    expect(stats.total).toBe(pageSize);
    expect(stats.mean).toBeGreaterThan(0);
    expect(stats.mean < 100).toBe(true);
    expect(stats.min <= stats.mean).toBe(true);
    expect(stats.max >= stats.mean).toBe(true);
  }, { id: 'pagination_stats' });

  test('should format multilingual API data', async ({ std, request }) => {
    const product = {
      id: std.crypto.uuid(),
      sku: std.string.constantCase(std.random.alphanumeric(8)),
      names: {
        en: std.string.titleCase(std.random.words(2)),
        slug: std.string.kebabCase(std.random.words(2))
      },
      price: {
        amount: parseFloat(std.random.amount(10, 1000, 2)),
        currency: std.random.currencyCode()
      },
      metadata: {
        createdAt: std.datetime.nowISO(),
        createdBy: std.random.email()
      }
    };

    // Validate all fields
    expect(std.validate.isUUID(product.id)).toBe(true);
    expect(std.validate.isEmail(product.metadata.createdBy)).toBe(true);
    expect(product.names.slug).toMatch(/^[a-z0-9-]+$/);
    expect(product.sku).toMatch(/^[A-Z0-9_]+$/);
    expect(product.price.amount).toBeGreaterThan(0);

    const response = await request.post('https://httpbin.org/post', product);
    expect(response).toHaveStatus(200);
  }, { id: 'multilingual_data' });

  test('should implement retry logic with exponential backoff', async ({ std, request }) => {
    const maxRetries = 3;
    const baseDelay = 50; // ms

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const requestId = std.crypto.uuid();
      const timestamp = std.datetime.nowISO();

      try {
        const response = await request.get('https://httpbin.org/get', {
          headers: {
            'X-Request-ID': requestId,
            'X-Attempt': String(attempt),
            'X-Timestamp': timestamp
          }
        });

        expect(response).toHaveStatus(200);
        expect(std.validate.isUUID(requestId)).toBe(true);
        break; // Success, exit loop
      } catch (error) {
        if (attempt === maxRetries) throw error;

        // Calculate exponential backoff delay
        const delay = baseDelay * Math.pow(2, attempt - 1);
        const jitter = std.random.int(0, 50);
        await new Promise(resolve => setTimeout(resolve, delay + jitter));
      }
    }
  }, { id: 'retry_backoff' });
});
