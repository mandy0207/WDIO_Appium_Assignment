import Page from './page.js';
class LandingPage extends Page {
    public get viewMenuButton() {
        return $('~View menu');
    }
    public get loginMenuButton() {
        return $('~Login Menu Item');
    }
    
    public async navigateToViewMenu() {
        await this.viewMenuButton.waitForDisplayed();
        await this.viewMenuButton.click();
    }
    
    public async navigateToLoginPage() {
        await this.loginMenuButton.waitForDisplayed();
        await this.loginMenuButton.click();
    }
}

export default new LandingPage();