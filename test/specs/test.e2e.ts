import { expect } from '@wdio/globals'
import landingPage from '../pageobjects/landing.page.js'
import loginPage from '../pageobjects/login.page.js'
import { getCredentials, getProductName } from '../utils/testDataReader.js'
import productsPage from '../pageobjects/products.page.js'
import cartPage from '../pageobjects/cart.page.js'
import checkoutPage from '../pageobjects/checkout.page.js'
import { generateCheckoutFormData } from '../utils/fakeDataGenerator.js'
import orderPage from '../pageobjects/order.page.js'

describe('My Demo App', () => {
    it('E2E Scenario', async () => {
      const { username, password } = getCredentials('standard');
      const productName = getProductName('backpackViolet');

      await landingPage.navigateToViewMenu();
      await expect(landingPage.viewMenuButton).toBeDisplayed();
      await landingPage.navigateToLoginPage();
      await expect(loginPage.inputUsername).toBeDisplayed();
      await loginPage.login(username, password);

      await productsPage.waitForProductsToLoad();
      const titles =  productsPage.productTitles;
      expect(titles.length).toBeGreaterThan(0);

      await productsPage.selectProduct(productName);
      await expect(productsPage.addToCartButton).toBeDisplayed();
      await productsPage.clickAddToCartButton();
      await productsPage.clickViewCartButton();
      const productNamesInCart = await cartPage.getProductNamesInCart();
      expect(productNamesInCart).toContain(productName);

      await cartPage.proceedToCheckout();
      const checkoutFormData = generateCheckoutFormData();
      await checkoutPage.fillCheckoutForm(checkoutFormData);
      await checkoutPage.clickToPaymentButton();
      await checkoutPage.fillPaymentForm(checkoutFormData);
      await checkoutPage.reviewOrder();
      const pricesDetails = await orderPage.getPricesDetails();
      expect(parseFloat(pricesDetails.totalPrice)).toBeGreaterThan(parseFloat(pricesDetails.productPrice));
      await orderPage.placeOrder();
      const swagHeaderText = await orderPage.getSwagHeaderText();
      const expectedSwagHeaderText = getProductName('swagHeader');
      expect(swagHeaderText).toBe(expectedSwagHeaderText);
    })
})

