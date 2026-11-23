import { APIRequestContext, APIResponse } from '@playwright/test';

export class UserService {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseURL: string,
  ) {}

  getAll(): Promise<APIResponse> {
    return this.request.get(`${this.baseURL}/users`);
  }

  getById(id: number): Promise<APIResponse> {
    return this.request.get(`${this.baseURL}/users/${id}`);
  }
}
