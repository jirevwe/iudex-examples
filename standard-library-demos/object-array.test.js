import { describe, test, expect } from 'iudex';

describe('Standard Library - Object/Array', { prefix: 'stdlib.object' }, () => {
  test('should pick and omit object keys', async ({ std }) => {
    const user = {
      id: 1,
      name: 'John',
      email: 'john@example.com',
      password: 'secret',
      role: 'admin'
    };

    const publicUser = std.object.pick(user, ['id', 'name', 'email']);
    expect(publicUser).toEqual({
      id: 1,
      name: 'John',
      email: 'john@example.com'
    });

    const sanitized = std.object.omit(user, ['password']);
    expect(sanitized).not.toHaveProperty('password');
    expect(sanitized).toHaveProperty('name');
  }, { id: 'pick_omit' });

  test('should merge objects deeply', async ({ std }) => {
    const defaults = {
      theme: 'light',
      options: {
        notifications: true,
        sound: true
      }
    };

    const userPrefs = {
      options: {
        sound: false
      }
    };

    const merged = std.object.merge(defaults, userPrefs);
    expect(merged.theme).toBe('light');
    expect(merged.options.notifications).toBe(true);
    expect(merged.options.sound).toBe(false);
  }, { id: 'deep_merge' });

  test('should clone objects deeply', async ({ std }) => {
    const original = {
      name: 'test',
      nested: { value: 42 }
    };

    const cloned = std.object.clone(original);
    cloned.nested.value = 100;

    expect(original.nested.value).toBe(42); // Original unchanged
    expect(cloned.nested.value).toBe(100);
  }, { id: 'deep_clone' });

  test('should get and set nested properties', async ({ std }) => {
    const obj = {
      user: {
        profile: {
          name: 'John'
        }
      }
    };

    const name = std.object.get(obj, 'user.profile.name');
    expect(name).toBe('John');

    const missing = std.object.get(obj, 'user.profile.age', 25);
    expect(missing).toBe(25);

    std.object.set(obj, 'user.profile.age', 30);
    expect(obj.user.profile.age).toBe(30);

    expect(std.object.has(obj, 'user.profile.name')).toBe(true);
    expect(std.object.has(obj, 'user.profile.missing')).toBe(false);
  }, { id: 'nested_access' });

  test('should work with object keys, values, entries', async ({ std }) => {
    const obj = { a: 1, b: 2, c: 3 };

    expect(std.object.keys(obj)).toEqual(['a', 'b', 'c']);
    expect(std.object.values(obj)).toEqual([1, 2, 3]);
    expect(std.object.entries(obj)).toEqual([['a', 1], ['b', 2], ['c', 3]]);

    const reconstructed = std.object.fromEntries([['a', 1], ['b', 2]]);
    expect(reconstructed).toEqual({ a: 1, b: 2 });
  }, { id: 'keys_values_entries' });

  test('should flatten arrays', async ({ std }) => {
    const nested = [1, [2, 3], [4, [5, 6]]];

    const flat1 = std.array.flatten(nested, 1);
    expect(flat1).toEqual([1, 2, 3, 4, [5, 6]]);

    const flatDeep = std.array.flattenDeep(nested);
    expect(flatDeep).toEqual([1, 2, 3, 4, 5, 6]);
  }, { id: 'array_flatten' });

  test('should remove duplicates from arrays', async ({ std }) => {
    const duplicates = [1, 2, 2, 3, 3, 3, 4];
    const unique = std.array.unique(duplicates);
    expect(unique).toEqual([1, 2, 3, 4]);

    const users = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
      { id: 1, name: 'John' }
    ];
    const uniqueUsers = std.array.uniqueBy(users, 'id');
    expect(uniqueUsers).toHaveLength(2);
  }, { id: 'array_unique' });

  test('should chunk arrays', async ({ std }) => {
    const numbers = [1, 2, 3, 4, 5, 6, 7];
    const chunks = std.array.chunk(numbers, 3);

    expect(chunks).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
  }, { id: 'array_chunk' });

  test('should remove falsy values', async ({ std }) => {
    const mixed = [0, 1, false, 2, '', 3, null, undefined, 4];
    const compact = std.array.compact(mixed);

    expect(compact).toEqual([1, 2, 3, 4]);
  }, { id: 'array_compact' });

  test('should group array by property', async ({ std }) => {
    const users = [
      { name: 'John', role: 'admin' },
      { name: 'Jane', role: 'user' },
      { name: 'Bob', role: 'admin' }
    ];

    const grouped = std.array.groupBy(users, 'role');
    expect(grouped.admin).toHaveLength(2);
    expect(grouped.user).toHaveLength(1);
  }, { id: 'array_group_by' });

  test('should sort array by property', async ({ std }) => {
    const users = [
      { name: 'Charlie', age: 30 },
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 35 }
    ];

    const sortedByName = std.array.sortBy(users, 'name');
    expect(sortedByName[0].name).toBe('Alice');

    const sortedByAge = std.array.sortBy(users, 'age', ['desc']);
    expect(sortedByAge[0].age).toBe(35);
  }, { id: 'array_sort_by' });

  test('should perform array operations', async ({ std }) => {
    const arr = [1, 2, 3, 4, 5];

    expect(std.array.first(arr)).toBe(1);
    expect(std.array.last(arr)).toBe(5);
    expect(std.array.nth(arr, 2)).toBe(3);
    expect(std.array.take(arr, 2)).toEqual([1, 2]);
    expect(std.array.takeLast(arr, 2)).toEqual([4, 5]);
  }, { id: 'array_operations' });

  test('should perform set operations on arrays', async ({ std }) => {
    const arr1 = [1, 2, 3];
    const arr2 = [2, 3, 4];

    expect(std.array.intersection(arr1, arr2)).toEqual([2, 3]);
    expect(std.array.union(arr1, arr2)).toEqual([1, 2, 3, 4]);
    expect(std.array.difference(arr1, arr2)).toEqual([1]);
  }, { id: 'array_set_operations' });

  test('should calculate array statistics', async ({ std }) => {
    const numbers = [1, 2, 3, 4, 5];

    expect(std.array.sum(numbers)).toBe(15);
    expect(std.array.mean(numbers)).toBe(3);
    expect(std.array.min(numbers)).toBe(1);
    expect(std.array.max(numbers)).toBe(5);
  }, { id: 'array_statistics' });

  test('should sanitize API response', async ({ std, request }) => {
    const response = await request.get('https://httpbin.org/get');
    expect(response).toHaveStatus(200);

    // Remove sensitive headers from response
    const sanitized = std.object.omit(response.body.headers, [
      'X-Amzn-Trace-Id'
    ]);

    expect(sanitized).not.toHaveProperty('X-Amzn-Trace-Id');
  }, { id: 'sanitize_response' });

  test('should transform data for API request', async ({ std, request }) => {
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'secret123',
      internalId: 'xyz'
    };

    // Pick only fields for API
    const apiPayload = std.object.pick(userData, [
      'firstName',
      'lastName',
      'email'
    ]);

    const response = await request.post('https://httpbin.org/post', apiPayload);

    expect(response).toHaveStatus(200);
    expect(response.body.json).not.toHaveProperty('password');
    expect(response.body.json).not.toHaveProperty('internalId');
  }, { id: 'transform_api_data' });
});
