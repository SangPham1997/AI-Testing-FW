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
- Allure Report 3 dùng CLI npm, không cần cài Java.

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
| `npm run report` | Mở Playwright HTML report tại `reports/html-report/` |
| `npm run test:allure` | Chạy test rồi generate Allure report |
| `npm run allure:generate` | Generate Allure report từ `allure-results/` |
| `npm run allure:open` | Mở Allure report đã generate |
| `npm run allure:clean` | Xóa `allure-results/` cũ |

Chọn môi trường qua biến `TEST_ENV` (`dev` | `staging` | `prod`):

```bash
# Bash / CI
TEST_ENV=staging npm test

# PowerShell
$env:TEST_ENV = 'staging'; npm test
```

Cả ba môi trường hiện trỏ tới cùng SUT public. Khi có môi trường riêng, chỉ cần cập nhật `config/environments.ts`.

## Allure Report

Cả hai project `ui` và `api` đều dùng chung reporter `allure-playwright`, được cấu hình trong `playwright.config.ts`. Kết quả thô nằm trong `allure-results/`; báo cáo HTML được generate vào `allure-report/`. Hai thư mục này đã được ignore trong `.gitignore`.

Chạy local:

```bash
# Cách 1: chạy test và generate report khi test pass
npm run test:allure

# Cách 2: chạy riêng từng bước
npm test
npm run allure:generate
npm run allure:open
```

Các script `test`, `test:ui`, `test:api`, `test:headed`, `test:debug` và `test:allure` đều xóa `allure-results/` cũ trước khi chạy, để report không bị trộn kết quả giữa các lần. Nếu chạy `npx playwright test` trực tiếp, chạy `npm run allure:clean` trước.

`npm run test:allure` dùng `&&`, nên nếu test fail thì report chưa được generate. Khi đó chạy `npm run allure:generate` để tạo report từ kết quả mà Playwright đã ghi lại. Trên CI, job Allure luôn chạy với `if: always()` nên report vẫn được tạo khi test fail.

Một report duy nhất chứa cả UI và API, kèm thông tin môi trường (OS, Node, `TEST_ENV`, CI) và trace/screenshot/video của Playwright khi test fail.

## Cấu trúc thư mục

```text
.
├── .github/workflows/playwright.yml   # CI matrix ui/api + Allure Pages
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

- `ui`: cài Chromium rồi chạy `npm run test:ui`.
- `api`: không cài browser, chạy `npm run test:api`.

Ngoài Playwright report, mỗi job matrix upload Allure results riêng (`allure-results-ui`, `allure-results-api`). Job `Generate Allure report` tải và merge hai bộ results, generate một report chung, upload artifact `allure-report` và ghi summary vào trang run.

Với `push` hoặc `workflow_dispatch`, job `Publish Allure report to GitHub Pages` deploy report lên GitHub Pages. Link report xuất hiện ở:

- mục **Environments** / **View deployment** của workflow run;
- phần **Job Summary** của job publish;
- URL cố định: `https://<owner>.github.io/<repo>/`.

Nhờ vậy có thể mở report trực tiếp từ GitHub Actions, không cần tải artifact. Với `pull_request`, job publish được bỏ qua để tránh lỗi quyền/Pages environment; report vẫn có trong artifact `allure-report` của run.

**Cấu hình một lần:** vào **Settings → Pages → Build and deployment → Source** và chọn **GitHub Actions**. Nếu Pages chưa được bật, job publish sẽ fail ở bước `Setup Pages`; workflow không tự bật Pages vì `GITHUB_TOKEN` không đủ quyền cho thao tác đó.

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

Tiêu chí hoàn thành: typecheck/lint sạch, `npm test` pass toàn bộ và hoàn tất trong dưới 60 giây trên máy local, Playwright HTML report mở được tại `reports/html-report/`, Allure report mở được tại `allure-report/`.
