import { test, expect } from '../../fixtures/pages.fixture';
import { users } from '../../test-data/users';

test.describe('Login', () => {
  test('happy path: standard user logs in successfully', async ({ loginPage, inventoryPage, page }) => {
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);

    await expect(page).toHaveURL(/inventory/);
    expect(await inventoryPage.getPageTitle()).toBe('Products');
    expect(await inventoryPage.getItemCount()).toBe(6);
  });

  test('error path: locked user sees lock-out message', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(users.locked.username, users.locked.password);

    await expect(loginPage.errorMessage).toContainText('Sorry, this user has been locked out');
  });

  test('error path: invalid credentials', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(users.invalid.username, users.invalid.password);

    await expect(loginPage.errorMessage).toContainText('Username and password do not match');
  });
});
