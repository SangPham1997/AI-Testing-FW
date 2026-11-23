# Skill: heal-test-case

> Phân tích test case bị fail và đề xuất cách sửa locator / assertion / data.

## Mục tiêu

Nhận file test + kết quả fail (error message, screenshot, DOM snippet) để找出 nguyên nhân và sinh diff đề xuất fix, tuân thủ Page Object Model.

## Input

| Field | Bắt buộc | Mô tả |
|:---|:---:|:---|
| `spec_file` | ✅ | Đường dẫn file `.spec.ts` bị fail. |
| `error_message` | ✅ | Text error từ Playwright (locator timeout, assertion mismatch...). |
| `dom_snippet` | ❌ | HTML snippet trang khi test fail (tùy chọn). |
| `screenshot` | ❌ | Đường dẫn screenshot fail (tùy chọn). |

## Output

- Gợi ý diff (old → new) để sửa locator, assertion hoặc test data.
- Nếu cần, cập nhật Page Object `pages/<PageName>.ts`.
- Danh sách các test case liên quan có thể bị ảnh hưởng.

## Quy tắc bắt buộc

1. **Locator thay đổi**: Ưu tiên locator robust:
   - `role`, `data-test`, `aria-label` → `text=`, `css`, `xpath` → `id` → class.
   - Tránh locator dựa trên class tự động sinh (`.css-1abc`).
2. **Locator phải trong Page Object**: Không thay đổi locator trực tiếp trong `.spec.ts`, update `pages/<PageName>.ts` thay.
3. **Wait thay vì timeout**: Dùng `waitForLoadState()` / `waitFor()` thay vì tăng timeout.
4. **Assertion retry-friendly**: Thay `expect(locator).toHaveText()` thay vì `expect(await locator.textContent()).toBe()`.
5. **Kiểm tra test data**: Nếu fail do data, đề xuất thay đổi trong `test-data/` hoặc fixture.
6. **Fix không làm ảnh hưởng test khác**: Kiểm tra locator có unique không, không match nhầm element.

## Template Output

```diff
--- a/pages/<PageName>.ts
+++ b/pages/<PageName>.ts
-   readonly <oldLocator>: Locator;
+   readonly <newLocator>: Locator;
```

## Prompt cho AI

```
Bạn là một AI test healer. Nhiệm vụ: phân tích và đề xuất fix cho test case bị fail.

SPEC FILE: {spec_file}
ERROR MESSAGE: {error_message}
DOM SNIPPET: {dom_snippet}
SCREENSHOT: {screenshot}

Quy tắc:
1. Đọc file spec và Page Object liên quan.
2. Xác định locator fail hoặc assertion sai.
3. Đề xuất locator mới robust hơn (role/data-test/text/css).
4. Nếu locator thay đổi, đề xuất cập nhật Page Object.
5. Nếu fail do assertion, đề xuất expect phù hợp.
6. Nếu fail do data, đề xuất thay đổi test-data/.
7. Kiểm tra các test khác có dùng locator bị ảnh hưởng.

Output: diff đề xuất + giải thích từng thay đổi.
```

## Skill liên quan

- `generate-ui-test` / `generate-api-test` — để tạo lại test case sau khi đã healed.