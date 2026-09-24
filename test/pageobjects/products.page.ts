import Page from './page.js';

class ProductsPage extends Page {
    public get scrollableContainer() {
        return "//*[@resource-id='com.saucelabs.mydemoapp.android:id/scrollView']";
    }

    public get productTitles() {
        return $$("//*[@content-desc='Product Title']");
    }

    public get addToCartButton() {
        return $("~Tap to add product to cart");
    }

    public get viewCartButton() {
        return $("~View cart");
    }

    public async waitForProductsToLoad() {
        await $("(//*[@content-desc='Product Title'])[1]").waitForDisplayed();
    }

    public async scrollToProduct(title: string) {
        return this.scrollToElement(this.scrollableContainer, `//*[@text='${title}']`);
    }

    public async selectProduct(title: string) {
        await this.scrollToProduct(title);
        const productImage = await $(
            `//*[@text='${title}']/parent::*//android.widget.ImageView[@content-desc='Product Image']`
        );
        await productImage.click();
    }

    public async clickAddToCartButton() {
        await this.addToCartButton.click();
    }
    public async clickViewCartButton() {
        await this.viewCartButton.click();
    }

}

export default new ProductsPage();
