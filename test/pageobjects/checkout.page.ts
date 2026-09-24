import Page from './page.js';
import { CheckoutFormData } from '../types.js';

class CheckoutPage extends Page {

    public get fullNameInput() {
        return $("//android.widget.EditText[@resource-id='com.saucelabs.mydemoapp.android:id/fullNameET'] | //android.widget.EditText[@resource-id='com.saucelabs.mydemoapp.android:id/nameET']");
    }

    public get addressLine1Input() {
        return $("//android.widget.EditText[@resource-id='com.saucelabs.mydemoapp.android:id/address1ET']");
    }

    public get addressLine2Input() {
        return $("//android.widget.EditText[@resource-id='com.saucelabs.mydemoapp.android:id/address2ET']");
    }

    public get cityInput() {
        return $("//android.widget.EditText[@resource-id=\"com.saucelabs.mydemoapp.android:id/cityET\"]");
    }

    public get stateInput() {
        return $("//android.widget.EditText[@resource-id='com.saucelabs.mydemoapp.android:id/stateET']");
    }

    public get zipCodeInput() {
        return $("//android.widget.EditText[@resource-id=\"com.saucelabs.mydemoapp.android:id/zipET\"]");
    }

    public get countryInput() {
        return $("//android.widget.EditText[@resource-id=\"com.saucelabs.mydemoapp.android:id/countryET\"]");
    }

    public get cardNumberInput() {
        return $("//android.widget.EditText[@resource-id='com.saucelabs.mydemoapp.android:id/cardNumberET']");
    }

    public get expirationDateInput() {
        return $("//android.widget.EditText[@resource-id='com.saucelabs.mydemoapp.android:id/expirationDateET']");
    }

    public get securityCodeInput() {
        return $("//android.widget.EditText[@resource-id='com.saucelabs.mydemoapp.android:id/securityCodeET']");
    }

    public get toPaymentButton() {
        return $("~Saves user info for checkout");
    }

    public get reviewOrderButton() {
        return $("~Saves payment info and launches screen to review checkout data");
    }

    public async fillCheckoutForm(formData: CheckoutFormData) {
        await this.fullNameInput.setValue(formData.fullName);
        await this.addressLine1Input.setValue(formData.address1);
        await this.addressLine2Input.setValue(formData.address2);
        await this.cityInput.setValue(formData.city);
        await this.stateInput.setValue(formData.state);
        await this.zipCodeInput.setValue(formData.zip);
        await this.countryInput.setValue(formData.country);
    }

    public async fillPaymentForm(formData: CheckoutFormData){
         await this.fullNameInput.setValue(formData.fullName);
         await this.cardNumberInput.setValue(formData.cardNumber);
         await this.expirationDateInput.setValue("1010");
         await this.securityCodeInput.setValue(formData.securityCode);

    }

    public async clickToPaymentButton() {
        await this.toPaymentButton.click();
    }

    public async reviewOrder() {
        await this.reviewOrderButton.click();
    }
}

export default new CheckoutPage();