# Skills

Mỗi skill là một tác vụ AI đóng gói. Mỗi file mô tả mục tiêu, input, output, quy tắc và prompt mẫu.

| Skill | Input | Output |
|:---|:---|:---|
| `generate-ui-test` | URL + mô tả flow | File `.spec.ts` trong `tests/ui/` |
| `generate-api-test` | Endpoint + schema | File `.spec.ts` trong `tests/api/` |
| `heal-test-case` | File test bị fail + DOM | Diff gợi ý sửa locator |

## Kích hoạt qua Agent

Agent **Orchestrator** (`ai/agents/orchestrator.md`) là entry point duy nhất để điều phối các skill:

- Nhận yêu cầu → phân loại (`ui` / `api` / `heal`) → gọi skill tương ứng → validate → trả kết quả.

## Mỗi Skill cần có

- **Mục tiêu** — task này giải quyết gì.
- **Input** — các trường bắt buộc / tùy chọn.
- **Output** — file hoặc artifact cần tạo ra.
- **Quy tắc bắt buộc** — tuân thủ schema framework (Page Object, Service Layer, fixtures, test-data...).
- **Prompt mẫu** — template prompt để AI provider dùng.

## Danh sách Skill

| Tên file | Tác vụ | Người dùng |
|:---|:---|:---|
| [`generate-ui-test.md`](generate-ui-test.md) | Sinh Playwright UI test case từ flow mô tả. | Generator |
| [`generate-api-test.md`](generate-api-test.md) | Sinh Playwright API test case từ endpoint + schema. | Generator |
| [`heal-test-case.md`](heal-test-case.md) | Chữa test case bị fail (locator / assertion / data). | Healer |

> Cập nhật bảng khi thêm hoặc sửa skill mới.
