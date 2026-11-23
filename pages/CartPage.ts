// import { Locator, Page } from '@playwright/test';
// import { BasePage } from './BasePage';

// export class CartPage extends BasePage {
//   protected readonly path = '/cart.html';

//   readonly pageTitle: Locator;
//   readonly cartItems: Locator;
//   readonly checkoutButton: Locator;
//   readonly removeButtons: Locator;

//   constructor(page: Page) {
//     super(page);
//     this.pageTitle = page.locator('.title');
//     this.cartItems = page.locator('.cart_item');
//     this.checkoutButton = page.locator('#checkout');
//     this.removeButtons = page.locator('button:has-text("Remove")');
//   }

//   async getPageTitle(): Promise<string> {
//     return (await this.pageTitle.textContent()) ?? '';
//   }

//   async getItemCount(): Promise<number> {
//     return this.cartItems.count();
//   }

//   async getItemName(index: number = 0): Promise<string> {
//     return (await this.cartItems.nth(index).locator('.inventory_item_name').textContent()) ?? '';
//   }

//   async removeItem(index: number = 0): Promise<void> {
//     await this.removeButtons.nth(index).click();
//   }
// }