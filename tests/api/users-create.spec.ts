// import { test, expect } from '../../fixtures/api.fixture';
// import { newUser } from '../../test-data/users';

// test.describe('API: Users - Create', () => {
//   test('POST /users creates a new user', async ({ userService }) => {
//     const response = await userService.create(newUser);
//     expect(response.status()).toBe(201);

//     const body = await response.json();
//     expect(body).toHaveProperty('id');
//     expect(body).toHaveProperty('username');
//     expect(body).toHaveProperty('email');
//   });

//   test('POST /users with missing required field returns 400', async ({ userService }) => {
//     const response = await userService.create({ username: 'missing_password' });
//     expect(response.status()).toBe(400);
//   });
// });