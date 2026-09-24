export const iosCapabilities: WebdriverIO.Capabilities = {
    platformName: 'iOS',
    'appium:deviceName': 'iPhone 15',
    'appium:platformVersion': '17.0',
    'appium:automationName': 'XCUITest',
    'appium:app': './my-demo-app-ios.app',
    'appium:bundleId': 'com.saucelabs.mydemoapp',
    'appium:autoAcceptAlerts': true,
    'appium:noReset': true
};
