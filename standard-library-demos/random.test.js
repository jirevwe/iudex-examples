import { describe, test, expect } from 'iudex';

describe('Standard Library - Random Data', { prefix: 'stdlib.random' }, () => {
  test('should generate random primitives', async ({ std }) => {
    const num = std.random.int(1, 100);
    expect(num).toBeGreaterThanOrEqual(1);
    expect(num).toBeLessThanOrEqual(100);

    const float = std.random.float(0, 1, 2);
    expect(float).toBeGreaterThanOrEqual(0);
    expect(float).toBeLessThanOrEqual(1);

    const bool = std.random.boolean();
    expect(typeof bool).toBe('boolean');
  }, { id: 'random_primitives' });

  test('should generate random strings', async ({ std }) => {
    const alphanum = std.random.alphanumeric(10);
    expect(alphanum).toMatch(/^[a-zA-Z0-9]{10}$/);

    const hexStr = std.random.hex(16);
    expect(hexStr).toMatch(/^[a-f0-9]{16}$/);
  }, { id: 'random_strings' });

  test('should generate random identifiers', async ({ std }) => {
    const email = std.random.email();
    expect(email).toMatch(/^[^@]+@[^@]+\.[^@]+$/);

    const username = std.random.username();
    expect(username).toBeTruthy();

    const password = std.random.password(16);
    expect(password.length).toBeGreaterThanOrEqual(16);
  }, { id: 'random_identifiers' });

  test('should generate random network data', async ({ std }) => {
    const ipv4 = std.random.ipv4();
    expect(ipv4).toMatch(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/);

    const url = std.random.url();
    expect(url).toMatch(/^https?:\/\/.+/);

    const domain = std.random.domain();
    expect(domain).toContain('.');
  }, { id: 'random_network' });

  test('should generate random personal data', async ({ std }) => {
    const firstName = std.random.firstName();
    expect(firstName).toBeTruthy();

    const lastName = std.random.lastName();
    expect(lastName).toBeTruthy();

    const fullName = std.random.fullName();
    expect(fullName).toContain(' ');

    const phone = std.random.phoneNumber();
    expect(phone).toBeTruthy();
  }, { id: 'random_personal_data' });

  test('should generate random location data', async ({ std }) => {
    const city = std.random.city();
    expect(city).toBeTruthy();

    const country = std.random.country();
    expect(country).toBeTruthy();

    const latitude = std.random.latitude();
    expect(latitude).toBeGreaterThanOrEqual(-90);
    expect(latitude).toBeLessThanOrEqual(90);

    const longitude = std.random.longitude();
    expect(longitude).toBeGreaterThanOrEqual(-180);
    expect(longitude).toBeLessThanOrEqual(180);
  }, { id: 'random_location' });

  test('should generate random text', async ({ std }) => {
    const words = std.random.words(3);
    expect(words.split(' ')).toHaveLength(3);

    const sentence = std.random.sentence();
    expect(sentence).toBeTruthy();
    expect(sentence).toMatch(/\.$/);

    const paragraph = std.random.paragraph();
    expect(paragraph).toBeTruthy();
  }, { id: 'random_text' });

  test('should pick random array elements', async ({ std }) => {
    const colors = ['red', 'green', 'blue', 'yellow'];

    const element = std.random.arrayElement(colors);
    expect(colors).toContain(element);

    const elements = std.random.arrayElements(colors, 2);
    expect(elements).toHaveLength(2);
    elements.forEach(el => expect(colors).toContain(el));
  }, { id: 'random_array_elements' });

  test('should shuffle arrays', async ({ std }) => {
    const original = [1, 2, 3, 4, 5];
    const shuffled = std.random.shuffle(original);

    expect(shuffled).toHaveLength(5);
    expect(shuffled).toContain(1);
    expect(shuffled).toContain(5);
    // Original should not be modified
    expect(original).toEqual([1, 2, 3, 4, 5]);
  }, { id: 'shuffle_array' });

  test('should create test user with random data for API', async ({ std, request }) => {
    const user = {
      id: std.random.int(1, 10000),
      email: std.random.email(),
      firstName: std.random.firstName(),
      lastName: std.random.lastName(),
      username: std.random.username(),
      phone: std.random.phoneNumber(),
      address: {
        city: std.random.city(),
        country: std.random.country()
      }
    };

    const response = await request.post('https://httpbin.org/post', user);

    expect(response).toHaveStatus(200);
    expect(response.body.json.email).toBe(user.email);
    expect(response.body.json.firstName).toBe(user.firstName);
  }, { id: 'random_user_api' });

  test('should generate random product data', async ({ std, request }) => {
    const product = {
      id: std.random.uuid(),
      name: std.random.words(2),
      description: std.random.sentence(),
      price: std.random.amount(10, 1000, 2),
      sku: std.random.alphanumeric(8).toUpperCase()
    };

    const response = await request.post('https://httpbin.org/post', product);

    expect(response).toHaveStatus(200);
    expect(response.body.json.id).toBe(product.id);
    expect(response.body.json.sku).toMatch(/^[A-Z0-9]{8}$/);
  }, { id: 'random_product_data' });
});
