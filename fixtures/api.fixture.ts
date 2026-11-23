import { test as base } from '@playwright/test';
import { PostService } from '../api/PostService';
import { UserService } from '../api/UserService';

type ApiFixtures = {
  postService: PostService;
  userService: UserService;
};

export const test = base.extend<ApiFixtures>({
  postService: async ({ request, baseURL }, use) => {
    if (!baseURL) throw new Error('baseURL is required');
    await use(new PostService(request, baseURL));
  },
  userService: async ({ request, baseURL }, use) => {
    if (!baseURL) throw new Error('baseURL is required');
    await use(new UserService(request, baseURL));
  },
});

export { expect } from '@playwright/test';
