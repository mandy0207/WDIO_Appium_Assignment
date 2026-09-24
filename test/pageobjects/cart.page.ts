import Page from './page.js';

class CartPage extends Page {

    public get productNameElements() {
        return $$("//android.widget.TextView[@resource-id='com.saucelabs.mydemoapp.android:id/titleTV']");
    }

    public get proceedToCheckoutButton() {
        return $("~Confirms products for checkout");
    }

    public async getProductNamesInCart(): Promise<string[]> {
        await this.productNameElements[0].waitForDisplayed();
        const elements = await this.productNameElements;
        const names: string[] = [];
        for (const element of elements) {
            names.push(await element.getText());
        }
        return names;
    }

    public async proceedToCheckout() {
        await this.proceedToCheckoutButton.waitForDisplayed();
        await this.proceedToCheckoutButton.click();
    }
}

export default new CartPage();