# Agents

Agent là thực thể AI điều phối nhiều skill. Ví dụ hiện tại:

- **Orchestrator** — entry point duy nhất: nhận yêu cầu → phân loại (`ui` / `api` / `heal`) → gọi skill tương ứng → validate → trả kết quả.

Ví dụ dự kiến (phase sau):

- **Planner** — khám phá app, sinh kế hoạch kiểm thử.
- **Generator** — biến kế hoạch thành test code (dùng skill `generate-ui-test` / `generate-api-test`).
- **Healer** — chạy test, phân tích fail, đề xuất fix (dùng skill `heal-test-case`).

## Cấu trúc

```
ai/
├── README.md
├── agents/
│   ├── README.md
│   └── orchestrator.md
└── skills/
    ├── README.md
    ├── generate-ui-test.md
    ├── generate-api-test.md
    └── heal-test-case.md
```