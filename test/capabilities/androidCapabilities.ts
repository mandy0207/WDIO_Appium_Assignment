export const androidCapabilities: WebdriverIO.Capabilities = {
    platformName: 'Android',
    'appium:deviceName': 'emulator-5554',
    'appium:platformVersion': '14.0',
    'appium:automationName': 'UiAutomator2',
    'appium:app': './mda-2.2.0-25.apk',
    'appium:appPackage': 'com.saucelabs.mydemoapp.android',
    'appium:appActivity': '.view.activities.SplashActivity',
    'appium:autoGrantPermissions': true,
    'appium:noReset': true
};
