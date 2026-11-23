# Skill: generate-ui-test

> Sinh test case Playwright UI tự động dựa trên mô tả flow hoặc page object.

## Mục tiêu

Nhận mô tả một flow người dùng (hoặc URL + danh sách bước) và sinh file `.spec.ts` hoàn chỉnh trong `tests/ui/`, tuân thủ cấu trúc Page Object Model của framework.

## Input

| Field | Bắt buộc | Mô tả |
|:---|:---:|:---|
| `flow` | ✅ | Mô tả text / acceptance criteria của flow cần test. |
| `page_name` | ✅ | Tên trang (dùng cho file Page Object tương ứng). |
| `steps` | ❌ | Danh sách bước cụ thể (nếu có). Nếu thiếu, AI tự phân tích. |
| `test_data` | ❌ | Dữ liệu test hoặc tham chiếu đến `test-data/`. |

## Output

- File `tests/ui/<name>.spec.ts` mới (hoặc cập nhật nếu đã tồn tại).
- Page Object file `pages/<PageName>.ts` (nếu chưa có).
- Cập nhật `fixtures/pages.fixture.ts` nếu cần thêm page mới.

## Quy tắc bắt buộc

1. **Page Object Pattern**: Mọi tương tác UI phải thông qua Page Object class kế thừa `BasePage`. **Không** dùng `page.locator()` trực tiếp trong test.
2. **Import đúng fixture**: Luôn import `test, expect` từ `../../fixtures/pages.fixture`, **không** import từ `@playwright/test`.
3. **Test data**: Khai báo dữ liệu trong `test-data/` và export dưới dạng `const` object. Test phải tham chiếu dữ liệu từ đó.
4. **Expect rõ ràng**: Dùng `expect(locator).toHaveText()` / `toContainText()` / `toBeVisible()` thay vì check thủ công. Ưu tiên auto-retrying assertions.
5. **Đặt tên test**: Format: `happy path: ...` hoặc `error path: ...` hoặc `edge case: ...`.
6. **Timeout**: Dùng `TIMEOUTS` từ `config/timeouts.ts` nếu cần wait, không hardcode số.
7. **Không sleep/waitForTimeout**: Playwright tự động chờ element. Nếu cần, dùng `page.waitForLoadState()`.
8. **TypeScript strict**: File phải typecheck (`npm run typecheck` không lỗi).

## Template Output

```typescript
// tests/ui/<name>.spec.ts
import { test, expect } from '../../fixtures/pages.fixture';
import { <testDataName> } from '../../test-data/<file>';

test.describe('<Feature>', () => {
  test('happy path: <mô tả>', async ({ <pageName> }) => {
    await <pageName>.goto();
    // các bước...
    await expect(<pageName>.<locator>).toHaveText('<expected>');
  });

  test('error path: <mô tả>', async ({ <pageName> }) => {
    // ...
  });
});
```

## Prompt cho AI

```
Bạn là một AI test generator. Nhiệm vụ: sinh Playwright UI test case dựa trên:

FLOW: {flow}
PAGE NAME: {page_name}
STEPS: {steps}
TEST DATA: {test_data}

Quy tắc:
1. Kiểm tra pages/ có Page Object tương ứng. Nếu chưa có, tạo mới kế thừa BasePage.
2. Kiểm tra fixtures/pages.fixture.ts, thêm fixture nếu cần.
3. Kiểm tra test-data/, thêm data nếu cần.
4. Sinh file tests/ui/<name>.spec.ts theo template.
5. Mỗi test case phải có ít nhất 1 assertion với Playwright expect.
6. Đặt tên file và mô tả test bằng tiếng Anh, rõ ràng.

Output: nội dung các file cần tạo/cập nhật.
```