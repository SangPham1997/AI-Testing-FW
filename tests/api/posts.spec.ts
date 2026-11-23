import { test, expect } from '../../fixtures/api.fixture';
import { newPost } from '../../test-data/users';

test.describe('API: Posts', () => {
  test('GET /posts returns a list of posts', async ({ postService }) => {
    const response = await postService.getAll();
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });

  test('GET /posts/:id returns a valid post', async ({ postService }) => {
    const response = await postService.getById(1);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toMatchObject({ id: 1 });
    expect(body).toHaveProperty('title');
    expect(body).toHaveProperty('body');
    expect(body).toHaveProperty('userId');
  });

  test('POST /posts creates a new post', async ({ postService }) => {
    const response = await postService.create(newPost);
    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.title).toBe(newPost.title);
    expect(body.body).toBe(newPost.body);
    expect(body.userId).toBe(newPost.userId);
    expect(body).toHaveProperty('id');
  });

  // jsonplaceholder does not return 404 for an unknown post id: it returns 200 with
  // an empty object. Verify the 404 contract against an unknown endpoint instead.
  test('GET unknown endpoint returns 404', async ({ postService }) => {
    const response = await postService.getUnknownEndpoint();
    expect(response.status()).toBe(404);
  });
});
