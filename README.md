# AI Testing Framework

Bộ khung kiểm thử tự động viết bằng **TypeScript + Playwright**, phục vụ cả **UI testing** và **API testing** trong cùng một runner. Cấu trúc được thiết kế sẵn để tích hợp AI agent ở giai đoạn sau mà không cần tái cấu trúc hạ tầng.

## Mục tiêu

- UI test ổn định với Page Object Model.
- API test nhanh, không cần browser, với Service layer.
- Playwright fixtures để compose dependencies thay vì kế thừa base class.
- CI chạy song song hai project `ui` và `api`.
- Skeleton `ai/` và `.mcp.json` cho AI coding assistant.

## Yêu cầu

- Node.js 20 LTS trở lên.
- npm 10 trở lên.
- Kết nối Internet tới `saucedemo.com` và `jsonplaceholder.typicode.com`.

## Cài đặt

```bash
npm ci
npx playwright install chromium
```

Nếu chưa có `package-lock.json` (lần đầu khởi tạo), dùng `npm install` thay cho `npm ci`.

## Chạy test

| Lệnh | Mô tả |
| :--- | :--- |
| `npm test` | Chạy toàn bộ test (UI + API) |
| `npm run test:ui` | Chỉ chạy project `ui` |
| `npm run test:api` | Chỉ chạy project `api` |
| `npm run test:headed` | Chạy UI test với browser hiển thị |
| `npm run test:debug` | Chạy Playwright Inspector |
| `npm run typecheck` | Kiểm tra TypeScript, không emit file |
| `npm run lint` | Chạy ESLint |
| `npm run report` | Mở HTML report tại `reports/html-report/` |

Chọn môi trường qua biến `TEST_ENV` (`dev` | `staging` | `prod`):

```bash
# Bash / CI
TEST_ENV=staging npm test

# PowerShell
$env:TEST_ENV = 'staging'; npm test
```

Cả ba môi trường hiện trỏ tới cùng SUT public. Khi có môi trường riêng, chỉ cần cập nhật `config/environments.ts`.

## Cấu trúc thư mục

```text
.
├── .github/workflows/playwright.yml   # CI matrix ui/api
├── .mcp.json                          # Playwright MCP cho AI assistant
├── ai/                                # Skeleton AI (sidecar, không import vào test)
│   ├── agents/README.md
│   ├── skills/README.md
│   └── README.md
├── api/                               # API service layer
│   ├── PostService.ts
│   └── UserService.ts
├── config/
│   ├── environments.ts
│   └── timeouts.ts
├── fixtures/
│   ├── api.fixture.ts
│   └── pages.fixture.ts
├── pages/                             # Page Object Model
│   ├── BasePage.ts
│   ├── InventoryPage.ts
│   └── LoginPage.ts
├── test-data/
│   └── users.ts
├── tests/
│   ├── api/
│   │   ├── posts.spec.ts
│   │   └── users.spec.ts
│   └── ui/
│       └── login.spec.ts
├── eslint.config.js
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

## Quy ước thiết kế

1. **Hai project Playwright** — `ui` dùng browser, `api` chỉ dùng `APIRequestContext`. Nhờ vậy API test không phải khởi động Chromium.
2. **Fixtures thay vì base test class** — mỗi test khai báo đúng dependency cần dùng; fixture có thể compose.
3. **Page Object cho UI, Service cho API** — locator và endpoint chỉ nằm trong lớp tương ứng, không hardcode trong `.spec.ts`.
4. **Relative imports, không path alias** — tránh cấu hình module resolution phức tạp với Playwright.
5. **Gọi API thật ở phase 1** — chưa mock; mocking sẽ được thêm sau.
6. **Không dùng `dotenv`** — public API không cần secret; thêm khi có môi trường cần credentials.

## Thêm test mới

### UI test

1. Tạo Page Object mới trong `pages/`, kế thừa `BasePage` và khai báo locator trong constructor.
2. Đăng ký Page Object đó trong `fixtures/pages.fixture.ts` nếu test cần dùng.
3. Tạo file `tests/ui/<feature>.spec.ts`, import `test`/`expect` từ `../../fixtures/pages.fixture`.
4. Không đặt selector trực tiếp trong file spec.

### API test

1. Thêm method vào service tương ứng trong `api/` (hoặc tạo service mới).
2. Đăng ký service trong `fixtures/api.fixture.ts`.
3. Tạo file `tests/api/<resource>.spec.ts`, import fixture từ `../../fixtures/api.fixture`.
4. Không hardcode URL/endpoint trong file spec; dùng service.

## Ghi chú về SUT

- **UI:** `https://www.saucedemo.com` — tài khoản chuẩn `standard_user` / `secret_sauce`.
- **API:** `https://jsonplaceholder.typicode.com` — REST API công khai.
- jsonplaceholder **không** trả về 404 cho post id không tồn tại (trả `{}` với 200). Vì vậy test 404 dùng một endpoint không tồn tại; behavior này được ghi chú ngay trong `tests/api/posts.spec.ts`.

## CI/CD

Workflow `.github/workflows/playwright.yml` chạy trên push/PR tới `main` hoặc `develop`, và có thể trigger thủ công. Matrix gồm hai job song song:

- `ui`: cài Chromium rồi chạy `npx playwright test --project=ui`.
- `api`: không cài browser, chạy `npx playwright test --project=api`.

Report được upload thành artifact `playwright-report-ui` / `playwright-report-api` trong 7 ngày.

## AI skeleton

Thư mục `ai/` là sidecar: không được import từ test suite và không ảnh hưởng tới `playwright test`. `.mcp.json` cấu hình Playwright MCP để AI coding assistant có thể điều khiển browser khi phát triển test.

Các bước tiếp theo dự kiến:

1. Implement skill `generate-api-test` dựa trên `api/PostService.ts`.
2. Thêm agent Planner/Generator/Healer.
3. Bổ sung mocking và visual testing khi cần.

## Kiểm tra chất lượng

```bash
npm run typecheck
npm run lint
npm run test:api
npm run test:ui
npm test
```

Tiêu chí hoàn thành: typecheck/lint sạch, `npm test` pass toàn bộ và hoàn tất trong dưới 60 giây trên máy local, HTML report mở được tại `reports/html-report/`.
