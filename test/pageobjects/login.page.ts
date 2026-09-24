import { $ } from '@wdio/globals'
import Page from './page.js';
import { platformLocator } from '../utils/locatorStrategy.js';

class LoginPage extends Page {
    public get inputUsername () {
        return $(platformLocator(
            '//android.widget.EditText[@resource-id="com.saucelabs.mydemoapp.android:id/nameET"]',
            '-ios predicate string:type == "XCUIElementTypeTextField"'
        ));
    }

    public get inputPassword () {
        return $(platformLocator(
            '//android.widget.EditText[@resource-id="com.saucelabs.mydemoapp.android:id/passwordET"]',
            '-ios predicate string:type == "XCUIElementTypeSecureTextField"'
        ));
    }

    public get btnSubmit () {
        return $(platformLocator(
            '~Tap to login with given credentials',
            '-ios predicate string:type == "XCUIElementTypeButton" AND label == "Login"'
        ));
    }

    public async login (username: string, password: string) {
        await this.inputUsername.setValue(username);
        await this.inputPassword.setValue(password);
        await this.btnSubmit.click();
    }
}

export default new LoginPage();
