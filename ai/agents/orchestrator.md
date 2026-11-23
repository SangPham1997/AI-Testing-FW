# Agent: Orchestrator

> AI agent điều phối nhiều skill để tạo và duy trì test case trong framework AI Testing.

## Mục tiêu

Orchestrator nhận yêu cầu cần tạo hoặc sửa test case (UI / API), phân tích yêu cầu, chọn skill phù hợp, liên tục điều phối cho đến khi test case đã được tạo / healed thành công và typecheck không lỗi.

## Input

| Field | Bắt buộc | Mô tả |
|:---|:---:|:---|
| `request` | ✅ | Yêu cầu tự nhiên: "viết test login thành công", "heal test case X"... |
| `type` | ✅ | `ui` | `api` | `heal`. |

## Skill liên quan

| Skill | Khi nào dùng |
|:---|:---|
| `generate-ui-test` | Tạo test case UI (Playwright Page Object). |
| `generate-api-test` | Tạo test case API (Service layer). |
| `heal-test-case` | Sửa test case bị fail (locator, assertion, data). |

## Quy trình xử lý

```
1. Nhận yêu cầu từ người dùng.
2. Phân loại yêu cầu thành ui / api / heal.
3. Chọn skill tương ứng và chuyển input.
4. Skill sinh file test case.
5. Chạy typecheck (tsc --noEmit) hoặc kiểm tra cú pháp.
   - Nếu lỗi: trả lại skill để sửa lại.
   - Nếu heal: chạy test bị fail để xác nhận đã fix.
6. Báo cáo kết quả: file đã tạo / đã sửa, tỉ lệ thành công.
```

## Output

- Danh sách file đã tạo / cập nhật.
- Thông báo thành công hoặc lỗi (nếu có).
- Tài liệu để người dùng chạy: `npm run typecheck`, `npm run test:ui` / `npm run test:api`.

## Prompt cho AI

```
Bạn là Orchestrator agent cho framework AI Testing.

YÊU CẦU: {request}
LOẠI: {type}

Quy trình:
1. Nếu type == "ui", dùng skill generate-ui-test.
2. Nếu type == "api", dùng skill generate-api-test.
3. Nếu type == "heal", dùng skill heal-test-case.
4. Sau khi sinh file, kiểm tra xem file đã tuân thủ quy tắc của framework chưa.
5. Trả về danh sách file đã tạo / cập nhật và hướng dẫn chạy.

Skill có sẵn: generate-ui-test, generate-api-test, heal-test-case.
Output: kết quả điều phối rõ ràng, liệt kê từng file thao tác.
```

## Cấu trúc framework tham chiếu

- `pages/` — Page Object (kế thừa `BasePage`).
- `api/` — Service wrapper (constructor `(request, baseURL)`).
- `fixtures/` — Playwright fixtures cho page và service.
- `test-data/` — dữ liệu test.
- `tests/ui/` — test case UI.
- `tests/api/` — test case API.
- `config/environments.ts` — base URL theo env.
- `config/timeouts.ts` — timeout constants.