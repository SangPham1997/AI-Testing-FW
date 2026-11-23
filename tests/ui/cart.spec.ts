import { test, expect } from '../../fixtures/pages.fixture';
import { users } from '../../test-data/users';

test.describe('UI: Cart', () => {
  test('happy path: add item to cart from inventory', async ({ loginPage, inventoryPage, cartPage }) => {
    await loginPage.goto();
    await loginPage.login(users.standard.username, users.standard.password);

    await inventoryPage.waitForReady();
    expect(await inventoryPage.getPageTitle()).toBe('Products');

    await inventoryPage.addItemToCart(0);

    await inventoryPage.cartLink.click();
    await cartPage.waitForReady();

    expect(await cartPage.getPageTitle()).toBe('Your Cart');
    expect(await cartPage.getItemCount()).toBeGreaterThan(0);
  });

  test('error path: empty cart shows no items', async ({ cartPage }) => {
    await cartPage.goto();
    await cartPage.waitForReady();

    expect(await cartPage.getItemCount()).toBe(0);
  });
});
