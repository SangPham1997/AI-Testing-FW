# Skill: generate-api-test

> Sinh test case API Playwright từ endpoint + response schema.

## Mục tiêu

Nhận thông tin endpoint (và schema nếu có) để sinh file `.spec.ts` API test trong `tests/api/`, gọi service wrapper tương ứng trong `api/`.

## Input

| Field | Bắt buộc | Mô tả |
|:---|:---:|:---|
| `endpoint` | ✅ | e.g. `POST /users`, `GET /users/:id`. |
| `method` | ✅ | `GET` / `POST` / `PUT` / `PATCH` / `DELETE`. |
| `description` | ✅ | Mô tả behavior mong muốn (happy path / error case). |
| `schema` | ❌ | JSON body hoặc response shape. |

## Output

- File `tests/api/<resource>.spec.ts` mới.
- Service wrapper tương ứng trong `api/<ServiceName>.ts` (nếu chưa có).

## Quy tắc bắt buộc

1. **Service Layer Pattern**: KHÔNG gọi `request.get/post` trực tiếp trong test. Phải qua service wrapper trong `api/` (vd. `UserService`) có constructor `(request, baseURL)`.
2. **Base URL**: Dùng từ `config/environments.ts` (`environments.<env>.apiBaseURL`). Không hardcode URL.
3. **Dữ liệu**: Dùng fixture hoặc object trong `test-data/`. Định dạng JSON body theo schema.
4. **Assertions chuẩn**:
   - `expect(response.status()).toBe(200)` cho happy path.
   - `expect(response.ok()).toBeTruthy()` / `toBeGreaterThan(0)`.
   - Body assertions với `toMatchObject`, `toEqual`, `toBeArray`...
   - Error cases: status 4xx/5xx + `await response.json()` có error message không.
5. **Test name**: Format: `"<Method> <endpoint> returns <expected behavior>"`.
6. **Type safety**: Response body parsing phải có type expectation hợp lý.

## Template Output

```typescript
import { test, expect } from '../../fixtures/api.fixture';

test.describe('<Resource>', () => {
  test('<Method> <endpoint> returns <expected behavior>', async ({ <resource>Service }) => {
    const response = await <resource>Service.<method>(...);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toMatchObject({ ... });
  });
});
```

## Prompt cho AI

```
Bạn là một AI test generator cho API. Nhiệm vụ: sinh API test case Playwright.

ENDPOINT: {endpoint}
METHOD: {method}
DESCRIPTION: {description}
SCHEMA: {schema}

Quy tắc:
1. Kiểm tra api/ có service wrapper tương ứng. Nếu chưa có, tạo class <Resource>Service.
2. Dùng baseURL từ config/environments.ts qua TEST_ENV.
3. Sinh file tests/api/<resource>.spec.ts.
4. Mỗi test có ít nhất 1 status code assertion và 1 body assertion.
5. Cover cả happy path và ít nhất 1 error path.

Output: nội dung các file cần tạo/cập nhật.
```

## Skill liên quan

- `heal-test-case` — khi API test fail và cần phân tích.