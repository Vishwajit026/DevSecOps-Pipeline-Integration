const test = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');

test('Health endpoint returns 200 and HEALTHY status', async () => {
  const req = { method: 'GET', url: '/health' };
  
  // Test route handler logic
  let statusCode = null;
  let responseData = null;

  const mockRes = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      responseData = data;
      return this;
    }
  };

  const handler = app._router.stack
    .filter(r => r.route && r.route.path === '/health')[0]
    .route.stack[0].handle;

  handler(req, mockRes);

  assert.strictEqual(statusCode, 200);
  assert.strictEqual(responseData.status, 'HEALTHY');
  assert.strictEqual(responseData.pipelineStage, 'DEVSECOPS_VERIFIED');
});

test('API user query requires valid input payload', async () => {
  const req = {
    method: 'POST',
    url: '/api/users/query',
    body: {}
  };

  let statusCode = null;
  let responseData = null;

  const mockRes = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      responseData = data;
      return this;
    }
  };

  const handler = app._router.stack
    .filter(r => r.route && r.route.path === '/api/users/query')[0]
    .route.stack[0].handle;

  handler(req, mockRes);

  assert.strictEqual(statusCode, 400);
  assert.match(responseData.error, /Valid username parameter is required/);
});
