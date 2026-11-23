# AI Integration (Skeleton)

Khu vực này dành cho các tích hợp AI agent trong tương lai.

## Cấu trúc
- `skills/` — định nghĩa các "skill" đóng gói (prompt, workflow) để AI assistant tái sử dụng.
- `agents/` — định nghĩa các agent tự động (planner, generator, healer).

## Nguyên tắc
- Không import từ thư mục này trong test suite.
- Đây là "sidecar" — chạy độc lập với `playwright test`.
- Mọi prompt/script phải tham chiếu ngược tới cấu trúc `pages/`, `api/`, `tests/` để output khớp.
