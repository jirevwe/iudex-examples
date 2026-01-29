import { describe, test, expect } from 'iudex';

describe('Standard Library - String', { prefix: 'stdlib.string' }, () => {
  test('should convert strings to different cases', async ({ std }) => {
    const input = 'hello world test';

    expect(std.string.camelCase(input)).toBe('helloWorldTest');
    expect(std.string.pascalCase(input)).toBe('HelloWorldTest');
    expect(std.string.snakeCase(input)).toBe('hello_world_test');
    expect(std.string.kebabCase(input)).toBe('hello-world-test');
    expect(std.string.constantCase(input)).toBe('HELLO_WORLD_TEST');
  }, { id: 'case_conversions' });

  test('should capitalize and format strings', async ({ std }) => {
    expect(std.string.capitalize('hello')).toBe('Hello');
    expect(std.string.titleCase('hello world')).toBe('Hello World');
    expect(std.string.upperCase('hello')).toBe('HELLO');
    expect(std.string.lowerCase('HELLO')).toBe('hello');
  }, { id: 'string_formatting' });

  test('should truncate long strings', async ({ std }) => {
    const longText = 'This is a very long string that needs to be truncated';

    expect(std.string.truncate(longText, 20)).toBe('This is a very lo...');
    expect(std.string.truncate(longText, 20, '...')).toBe('This is a very lo...');
    expect(std.string.truncate('short', 20)).toBe('short');
  }, { id: 'string_truncation' });

  test('should pad strings', async ({ std }) => {
    expect(std.string.padLeft('5', 3, '0')).toBe('005');
    expect(std.string.padRight('test', 10, '.')).toBe('test......');
  }, { id: 'string_padding' });

  test('should manipulate strings', async ({ std }) => {
    expect(std.string.reverse('hello')).toBe('olleh');
    expect(std.string.repeat('ab', 3)).toBe('ababab');
    expect(std.string.trim('  hello  ')).toBe('hello');
    expect(std.string.replaceAll('hello world', 'o', 'a')).toBe('hella warld');
  }, { id: 'string_manipulation' });

  test('should check string contains', async ({ std }) => {
    expect(std.string.contains('hello world', 'world')).toBe(true);
    expect(std.string.contains('hello world', 'foo')).toBe(false);
    expect(std.string.startsWith('hello world', 'hello')).toBe(true);
    expect(std.string.endsWith('hello world', 'world')).toBe(true);
  }, { id: 'string_contains' });

  test('should format API endpoint with case conversion', async ({ std, request }) => {
    const resourceName = 'user profiles';

    // Convert to different formats for different API conventions
    const kebabEndpoint = std.string.kebabCase(resourceName);
    const snakeEndpoint = std.string.snakeCase(resourceName);
    const camelEndpoint = std.string.camelCase(resourceName);

    expect(kebabEndpoint).toBe('user-profiles');
    expect(snakeEndpoint).toBe('user_profiles');
    expect(camelEndpoint).toBe('userProfiles');

    // Verify case conversions work correctly
    expect(std.string.contains(kebabEndpoint, '-')).toBe(true);
    expect(std.string.contains(snakeEndpoint, '_')).toBe(true);
  }, { id: 'api_endpoint_formatting' });

  test('should normalize user input for API', async ({ std, request }) => {
    const userInput = '  HELLO WORLD  ';

    const normalized = std.string.trim(userInput);
    const snake = std.string.snakeCase(normalized);

    // Verify normalization
    expect(normalized).toBe('HELLO WORLD');
    expect(snake).toBe('hello_world');

    const response = await request.post('https://httpbin.org/post', {
      normalizedInput: snake
    });

    expect(response).toHaveStatus(200);
  }, { id: 'normalize_user_input' });
});
