import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  protected readonly path = '/inventory.html';

  readonly pageTitle: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly inventoryItems: Locator;
  readonly addToCartButtons: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('.title');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.inventoryItems = page.locator('.inventory_item');
    this.addToCartButtons = page.locator('.inventory_item button:has-text("Add to cart")');
  }

  async getPageTitle(): Promise<string> {
    return (await this.pageTitle.textContent()) ?? '';
  }

  async getItemCount(): Promise<number> {
    return this.inventoryItems.count();
  }

  async addItemToCart(index: number = 0): Promise<void> {
    await this.addToCartButtons.nth(index).click();
  }

  async getCartBadgeCount(): Promise<string> {
    return (await this.cartBadge.textContent()) ?? '';
  }
}
