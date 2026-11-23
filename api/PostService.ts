import { APIRequestContext, APIResponse } from '@playwright/test';

export interface CreatePostPayload {
  title: string;
  body: string;
  userId: number;
}

export class PostService {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseURL: string,
  ) {}

  getAll(): Promise<APIResponse> {
    return this.request.get(`${this.baseURL}/posts`);
  }

  getById(id: number): Promise<APIResponse> {
    return this.request.get(`${this.baseURL}/posts/${id}`);
  }

  create(payload: CreatePostPayload): Promise<APIResponse> {
    return this.request.post(`${this.baseURL}/posts`, { data: payload });
  }

  /**
   * Requests a route that does not exist so callers can assert the 404 contract
   * without hardcoding an endpoint in a spec file.
   */
  getUnknownEndpoint(): Promise<APIResponse> {
    return this.request.get(`${this.baseURL}/nonexistent-endpoint-path`);
  }
}
