// Basic smoke test for validators.js
const validators = require('../js/validators');
describe('validators', () => {
  test('module should be defined', () => {
    expect(validators).toBeDefined();
  });
});
