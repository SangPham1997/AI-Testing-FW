import { APIRequestContext, APIResponse } from '@playwright/test';

export interface CreateUserPayload {
  username: string;
  password: string;
}

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

  create(payload: CreateUserPayload): Promise<APIResponse> {
    return this.request.post(`${this.baseURL}/users`, { data: payload });
  }
}