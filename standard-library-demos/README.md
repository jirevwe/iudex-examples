# Iudex Standard Library Demos

Comprehensive examples demonstrating the Iudex standard library utilities available in test contexts.

## Overview

The Iudex standard library (`std`) provides Postman-like utilities for API testing, including encoding, crypto, string manipulation, random data generation, date/time operations, object/array utilities, and validators.

## Available Utilities

### 1. **Encoding/Decoding** (`encoding.test.js`)
- Base64 encoding/decoding
- URL encoding/decoding
- JSON encoding/decoding

### 2. **Cryptography** (`crypto.test.js`)
- Hash functions (MD5, SHA1, SHA256, SHA512)
- HMAC signatures (SHA1, SHA256, SHA512)
- UUID generation
- Random bytes

### 3. **String Manipulation** (`string.test.js`)
- Case conversion (camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE)
- String formatting (capitalize, titleCase, uppercase, lowercase)
- Truncation, padding, reversal
- String utilities (trim, replace, contains, startsWith, endsWith)

### 4. **Date/Time** (`datetime.test.js`)
- Current time and formatting
- Date parsing and conversion
- Date arithmetic (add, subtract, diff)
- Date comparison (isBefore, isAfter, isBetween)
- Date components (year, month, day)

### 5. **Random Data** (`random.test.js`)
- Random primitives (int, float, boolean)
- Random strings (alphanumeric, hex)
- Random identifiers (email, username, password, UUID, IP, URL)
- Random personal data (names, phone, address)
- Random location data (city, country, coordinates)
- Random text (words, sentences, paragraphs)
- Array operations (shuffle, pick elements)

### 6. **Object/Array Utilities** (`object-array.test.js`)
- Object operations (pick, omit, merge, clone)
- Nested access (get, set, has)
- Array operations (flatten, unique, chunk, compact)
- Array grouping and sorting
- Set operations (intersection, union, difference)
- Array statistics (sum, mean, min, max)

### 7. **Validators** (`validators.test.js`)
- Format validation (email, URL, UUID, IP, JSON, base64, date, phone, hex)
- Type checking (isNumber, isString, isArray, isObject, etc.)
- Range validation (isLength, isInRange)
- Regex matching
- JSON Schema validation

### 8. **Comprehensive Examples** (`comprehensive.test.js`)
- Real-world scenarios combining multiple utilities
- Authentication flows
- Webhook signatures
- Data transformation
- Batch processing
- Token generation
- Pagination with statistics

## Running the Examples

### Run All Examples
```bash
npm test
```

### Run Specific Category
```bash
npm run test:encoding    # Encoding/decoding examples
npm run test:crypto      # Cryptography examples
npm run test:string      # String manipulation
npm run test:datetime    # Date/time operations
npm run test:random      # Random data generation
npm run test:object      # Object/array utilities
npm run test:validators  # Validators
npm run test:comprehensive  # Real-world examples
```

## Usage in Tests

All utilities are available via the `std` object in test context:

```javascript
import { describe, test, expect } from 'iudex';

describe('Example Test', () => {
  test('using standard library', async ({ std, request }) => {
    // Encoding
    const encoded = std.encode.base64('hello');

    // Crypto
    const hash = std.crypto.sha256('data');
    const signature = std.crypto.hmacSHA256('message', 'secret');
    const id = std.crypto.uuid();

    // String
    const camelCase = std.string.camelCase('hello world');
    const truncated = std.string.truncate('long text', 10);

    // DateTime
    const now = std.datetime.nowISO();
    const tomorrow = std.datetime.add(new Date(), 1, 'day');

    // Random
    const email = std.random.email();
    const name = std.random.fullName();
    const num = std.random.int(1, 100);

    // Object/Array
    const picked = std.object.pick(obj, ['id', 'name']);
    const unique = std.array.unique([1, 2, 2, 3]);

    // Validators
    const isValid = std.validate.isEmail('test@example.com');
    const result = std.validate.schema(data, schema);

    // Use in API request
    const response = await request.post('https://api.example.com/users', {
      id: id,
      email: email,
      hash: hash
    });

    expect(response).toHaveStatus(200);
  });
});
```

## Quick Reference

### Encoding
```javascript
std.encode.base64(str)       // Encode to base64
std.decode.base64(str)       // Decode from base64
std.encode.url(str)          // URL encode
std.decode.url(str)          // URL decode
std.encode.json(obj)         // Stringify JSON
std.decode.json(str)         // Parse JSON
```

### Crypto
```javascript
std.crypto.sha256(str)       // SHA-256 hash
std.crypto.hmacSHA256(str, key)  // HMAC-SHA256
std.crypto.uuid()            // Generate UUID
std.crypto.randomBytes(n)    // Random bytes
```

### String
```javascript
std.string.camelCase(str)    // Convert to camelCase
std.string.snakeCase(str)    // Convert to snake_case
std.string.truncate(str, n)  // Truncate string
std.string.contains(str, sub) // Check contains
```

### DateTime
```javascript
std.datetime.nowISO()        // Current ISO timestamp
std.datetime.add(date, n, unit)  // Add time
std.datetime.format(date, fmt)   // Format date
std.datetime.isBefore(d1, d2)    // Compare dates
```

### Random
```javascript
std.random.email()           // Random email
std.random.uuid()            // Random UUID
std.random.int(min, max)     // Random integer
std.random.fullName()        // Random name
```

### Object/Array
```javascript
std.object.pick(obj, keys)   // Pick keys
std.object.merge(o1, o2)     // Deep merge
std.array.unique(arr)        // Remove duplicates
std.array.sortBy(arr, key)   // Sort by property
```

### Validators
```javascript
std.validate.isEmail(str)    // Validate email
std.validate.isUUID(str)     // Validate UUID
std.validate.schema(data, schema)  // JSON Schema
std.validate.isInRange(n, min, max) // Range check
```

## Installation

This examples package is already set up. If you need to reinstall dependencies:

```bash
npm install
```

## Documentation

For complete API documentation, see the main Iudex documentation:
- [Standard Library Reference](../../iudex/docs/STANDARD_LIBRARY.md)
- [Iudex README](../../iudex/README.md)

## License

Same as Iudex framework.
