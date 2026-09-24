import Page from './page.js';
import stringManipulator from '../utils/stringManipulator.js';

class OrderPage extends Page {

    public get productPrice() {
        return $("//android.widget.TextView[@resource-id='com.saucelabs.mydemoapp.android:id/priceTV']");
    }

    public get totalPrice() {
        return $("//android.widget.TextView[@resource-id='com.saucelabs.mydemoapp.android:id/totalAmountTV']");
    }

    public get scrollableContainer() {
        return "//android.widget.ScrollView[@resource-id='com.saucelabs.mydemoapp.android:id/checkoutSV']";
    }

    public get completePaymentButton() {
        return $("~Completes the process of checkout");
    }

    public get swagHeader() {
        return $("//*[@resource-id='com.saucelabs.mydemoapp.android:id/swagTV']");
    }

    public async waitForReviewOrderToLoad() {
        await this.productPrice.waitForDisplayed();
    }

    public async getPricesDetails() {
        await this.waitForReviewOrderToLoad();
        await this.scrollToEnd(this.scrollableContainer);
        const productPriceText = await this.productPrice.getText();
        const totalPriceText = await this.totalPrice.getText();
        return {
            productPrice: stringManipulator.removeSpecialCharacters(productPriceText, '.'),
            totalPrice: stringManipulator.removeSpecialCharacters(totalPriceText, '.')
        };
    }

    public async placeOrder() {
        await this.completePaymentButton.click();
    }

    public async getSwagHeaderText() {
        await this.swagHeader.waitForDisplayed();
        return await this.swagHeader.getText();
    }

}

export default new OrderPage();