import { test, expect } from '../../fixtures/api.fixture';

test.describe('API: Users', () => {
  test('GET /users returns a list of users', async ({ userService }) => {
    const response = await userService.getAll();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });

  test('GET /users/:id returns user with expected shape', async ({ userService }) => {
    const response = await userService.getById(1);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toMatchObject({
      id: 1,
      name: expect.any(String),
      email: expect.any(String),
      username: expect.any(String),
    });
  });
});
