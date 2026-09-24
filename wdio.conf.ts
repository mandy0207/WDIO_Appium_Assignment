import { androidCapabilities } from './test/capabilities/androidCapabilities.js';
import { iosCapabilities } from './test/capabilities/iosCapabilities.js';

const platform = (process.env.PLATFORM ?? 'android').toLowerCase();

export const config: WebdriverIO.Config = {
    runner: 'local',
    tsConfigPath: './tsconfig.json',

    port: 4723,

    specs: [
        './test/specs/**/*.ts'
    ],
    exclude: [
    ],

    maxInstances: 10,

    capabilities: [
        platform === 'ios' ? iosCapabilities : androidCapabilities
    ],

    logLevel: 'info',

    bail: 0,

    waitforTimeout: 10000,

    connectionRetryTimeout: 120000,

    connectionRetryCount: 3,

    services: ['appium'],

    framework: 'mocha',

    reporters: [
        'spec',
        ['allure', {
            outputDir: 'allure-results',
            disableWebdriverStepsReporting: false,
            disableWebdriverScreenshotsReporting: false
        }]
    ],

    mochaOpts: {
        ui: 'bdd',
        timeout: 120000
    }
}
