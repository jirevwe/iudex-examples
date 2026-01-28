/**
 * Sample API Tests for GitHub Pages Dashboard Example
 *
 * These tests demonstrate various API testing scenarios and generate
 * data for the dashboard display.
 */

import { describe, test, expect } from 'iudex';

describe('HTTPBin API Tests', { prefix: 'httpbin' }, () => {
  test('GET request with query parameters', async ({ request }) => {
    const response = await request.get('/get', {
      params: {
        name: 'Iudex',
        version: '1.0'
      }
    });

    expect(response).toHaveStatus(200);
    expect(response.body).toHaveProperty('args');
    expect(response.body.args).toHaveProperty('name', 'Iudex');
    expect(response).toRespondWithin(2000);
  }, { id: 'get_with_params' });

  test('POST request with JSON body', async ({ request }) => {
    const payload = {
      username: 'testuser',
      email: 'test@example.com',
      timestamp: new Date().toISOString()
    };

    const response = await request.post('/post', {
      body: payload
    });

    expect(response).toHaveStatus(200);
    expect(response.body).toHaveProperty('json');
    expect(response.body.json).toMatchObject(payload);
    expect(response).toRespondWithin(2000);
  }, { id: 'post_json' });

  test('PUT request updates resource', async ({ request }) => {
    const response = await request.put('/put', {
      body: {
        id: 123,
        status: 'updated'
      }
    });

    expect(response).toHaveStatus(200);
    expect(response.body.json).toHaveProperty('status', 'updated');
  }, { id: 'put_update' });

  test('DELETE request', async ({ request }) => {
    const response = await request.delete('/delete');

    expect(response).toHaveStatus(200);
    expect(response.body).toHaveProperty('url');
  }, { id: 'delete_resource' });

  test('Request with custom headers', async ({ request }) => {
    const response = await request.get('/headers', {
      headers: {
        'X-Custom-Header': 'CustomValue',
        'X-Request-ID': '12345'
      }
    });

    expect(response).toHaveStatus(200);
    expect(response.body.headers).toHaveProperty('X-Custom-Header', 'CustomValue');
  }, { id: 'custom_headers' });

  test('Basic authentication', async ({ request }) => {
    const response = await request.get('/basic-auth/user/passwd', {
      auth: {
        username: 'user',
        password: 'passwd'
      }
    });

    expect(response).toHaveStatus(200);
    expect(response.body).toHaveProperty('authenticated', true);
  }, { id: 'basic_auth' });

  test('Status code validation', async ({ request }) => {
    const response = await request.get('/status/201');

    expect(response).toHaveStatus(201);
  }, { id: 'status_201' });

  test('Response format - JSON', async ({ request }) => {
    const response = await request.get('/json');

    expect(response).toHaveStatus(200);
    expect(response).toHaveHeader('content-type', /application\/json/);
    expect(response.body).toBeObject();
  }, { id: 'json_response' });

  test('Response delay handling', async ({ request }) => {
    const response = await request.get('/delay/1');

    expect(response).toHaveStatus(200);
    expect(response).toRespondWithin(5000);
  }, { id: 'delay_handling' });

  test('Error handling - 404', async ({ request }) => {
    try {
      await request.get('/status/404');
    } catch (error) {
      expect(error.response).toHaveStatus(404);
    }
  }, { id: 'error_404' });
});

describe('Response Validation Tests', { prefix: 'validation' }, () => {
  test('UUID format validation', async ({ request }) => {
    const response = await request.get('/uuid');

    expect(response).toHaveStatus(200);
    expect(response.body).toHaveProperty('uuid');
    expect(response.body.uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  }, { id: 'uuid_format' });

  test('Response time measurement', async ({ request }) => {
    const response = await request.get('/get');

    expect(response).toHaveStatus(200);
    expect(response.duration).toBeLessThan(3000);
  }, { id: 'response_time' });

  test('Content type validation', async ({ request }) => {
    const response = await request.get('/html');

    expect(response).toHaveStatus(200);
    expect(response).toHaveHeader('content-type', /text\/html/);
  }, { id: 'content_type' });
});

describe('Edge Cases', { prefix: 'edge' }, () => {
  test('Large response handling', async ({ request }) => {
    const response = await request.get('/bytes/1024');

    expect(response).toHaveStatus(200);
    expect(response.body).toBeDefined();
  }, { id: 'large_response' });

  test('Redirect following', async ({ request }) => {
    const response = await request.get('/redirect-to', {
      params: {
        url: 'https://httpbin.org/get',
        status_code: 302
      }
    });

    expect(response).toHaveStatus(200);
  }, { id: 'redirect_follow' });

  test('HTTP method reflection', async ({ request }) => {
    const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

    for (const method of methods) {
      const response = await request[method.toLowerCase()](`/${method.toLowerCase()}`);
      expect(response).toHaveStatus(200);
    }
  }, { id: 'method_reflection' });
});
