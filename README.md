# Mobile Automation Assessment

Appium + WebdriverIO end-to-end test suite for the Sauce Labs "My Demo App" Android native application. Covers login, product browsing, cart, checkout, payment and order review/pricing.

## Prerequisites

- Node.js and npm
- Android SDK with an emulator (`emulator-5554`, API 34) running, or a physical device
- Appium (installed as a dev dependency, launched automatically via `@wdio/appium-service`)
- The app under test (`mda-2.2.0-25.apk`) placed at the project root

## Running the Tests

Install dependencies:

```
npm install
```

Run the full suite (defaults to Android):

```
npm run wdio
```

Run explicitly against a given platform:

```
npm run wdio:android
npm run wdio:ios
```

### Allure Report

Test runs are recorded by the Allure reporter into `allure-results/`. To generate and view the HTML report:

```
npm run allure:report
```

This regenerates `allure-report/` and opens it in the browser. `npm run allure:generate` / `npm run allure:open` are available separately if you only need one step.

## Framework Structure

```
wdio.conf.ts                  WebdriverIO/Appium runner config; selects capabilities by platform
test/
  specs/                      Test specs (Mocha, BDD style)
  pageobjects/                Page Object Model — one class per screen
    page.ts                   Base class with shared helpers (scrolling)
    login.page.ts, cart.page.ts, checkout.page.ts, ...
  capabilities/                Platform-specific Appium capabilities
    androidCapabilities.ts
    iosCapabilities.ts
  utils/
    platform.ts                Runtime platform checks (isAndroid / isIOS)
    locatorStrategy.ts          Helper to pick a locator per platform
    testDataReader.ts           Typed reader for testData.json
    testData.json               Credentials and product names
    fakeDataGenerator.ts         Faker-based checkout/payment data generator
    stringManipulator.ts         String cleanup helper (e.g. strips currency symbols)
  types.ts                      Shared TypeScript types (e.g. CheckoutFormData)
```

The suite follows the **Page Object Model**: each screen is a class exposing element getters and user-facing actions (e.g. `login()`, `fillCheckoutForm()`), keeping the spec file focused on the test flow rather than locators or low-level Appium calls. Shared behavior (scrolling helpers) lives in the base `Page` class that every page object extends.

## Locator Strategy

Locators are defined as getters on each page object, generally preferring, in order:

1. **Accessibility ID** (`~label`) — maps to `content-desc` on Android and `accessibilityIdentifier` on iOS. Most robust and, when both app builds expose the same identifier, naturally cross-platform.
2. **XPath by resource-id** — used where no accessibility id exists, matching Android's `resource-id` attribute (e.g. `//android.widget.EditText[@resource-id='...nameET']`).

Locators are centralized in page object getters only — never inlined in specs — so a UI change only requires updating one place.

## Android / iOS Platform Differences

The app under test only ships an Android build in this repo, so all real runs are against Android. The framework is nonetheless structured to support iOS without reworking specs or page objects, isolating the differences to three places:

1. **Capabilities** (`test/capabilities/`) — `androidCapabilities.ts` (UiAutomator2, `appPackage`/`appActivity`) and `iosCapabilities.ts` (XCUITest, `bundleId`) are separate files. `wdio.conf.ts` picks between them based on a `PLATFORM` environment variable (`android` by default), so switching platforms never touches the config's test/runner logic.

2. **Locators** (`test/utils/locatorStrategy.ts`) — `platformLocator(androidLocator, iosLocator)` lets a page object getter return the right locator for the running platform, decided at runtime via `test/utils/platform.ts` (`isAndroid()` / `isIOS()`, backed by WebdriverIO's `driver.isAndroid`/`driver.isIOS`). Page objects and specs stay platform-agnostic; only the getter body branches. `login.page.ts` demonstrates this pattern.

3. **Native gestures** (`page.ts`) — platform-specific Appium `mobile:` command names (e.g. Android's `mobile: scrollGesture` vs iOS's `mobile: scroll`) are branched inside the shared `scrollToEnd()` helper, so callers just invoke one method regardless of platform.

Extending iOS coverage to the remaining page objects means adding the iOS-side locator argument to each `platformLocator(...)` call and supplying a real iOS app build under `iosCapabilities.ts`; the same pattern applies throughout the codebase without changing test flow or spec files.

## Reducing Flaky Tests as the Suite Grows

Several sources of flakiness have already been addressed and would be extended as more specs are added:

- **Explicit waits over fixed sleeps.** Every screen transition (e.g. cart loading, review-order screen rendering) is guarded by a `waitForXToLoad()` method on the relevant page object that waits for a specific element to be displayed, rather than a hard-coded delay. This was the fix for a real race condition where cart contents were read before the screen finished rendering.
- **Platform-safe commands only.** Helpers avoid WebdriverIO APIs that aren't supported by the driver in a native app context (e.g. `getHTML()`, which relies on `execute/sync` and was rejected by UiAutomator2) in favor of native-safe equivalents (`driver.getPageSource()`, `mobile:` commands). As the suite grows, new helpers should be verified against the real driver rather than assumed to work cross-context.
- **Resetting app/device state before each run.** The app and `uiautomator2` server are force-stopped via `adb` before a run to avoid stale-session errors carrying over between executions; the same principle (clean state per test) should extend to clearing app data or reinstalling between specs once there are enough specs to risk cross-test state leakage.
- **Centralized locators.** Because locators live only in page object getters, a broken selector only needs fixing in one place, reducing the chance of partial fixes that leave some tests flaky and others not.
- **Generous but bounded timeouts.** The Mocha timeout was raised (60s → 120s) once the flow grew multi-screen; this should be tuned per suite size rather than raised indefinitely, and slow steps should be isolated with their own explicit waits instead of relying on a large global timeout to paper over them.

Additional practices to introduce as the suite scales further:

- **Retry at the spec level** (`specFileRetries` in `wdio.conf.ts`) for occasional device/emulator hiccups, combined with failure screenshots/video (via the Allure reporter) to distinguish real bugs from environment flakiness.
- **Isolate test data per test** (e.g. faker-generated checkout data, already in use) so tests don't collide on shared state, and avoid order-dependent tests.
- **Run against a stable, pinned app build and OS/emulator image version** so failures are reproducible and not caused by environment drift.
- **Quarantine/tag known-flaky tests** (e.g. a `@flaky` Mocha tag) so they can be tracked and fixed without blocking the rest of the suite, rather than being silently retried forever.

## Running on a Cloud Device Platform (BrowserStack / Sauce Labs)

The current structure — capabilities isolated in `test/capabilities/`, selected via an environment variable in `wdio.conf.ts` — extends naturally to cloud providers without touching specs or page objects:

1. **Add a cloud service and cloud capabilities file(s)**, e.g. `test/capabilities/browserstackCapabilities.ts` or `sauceCapabilities.ts`, containing the provider-specific keys instead of local emulator ones — for example, `bstack:options` (`appium:app` referencing an uploaded `bs://<app-id>`, `deviceName`, `osVersion`, project/build name) for BrowserStack, or `sauce:options` (`appium:app` as `storage:<app-id>`, `build`, `name`) plus `platformName`/`appium:deviceName` for Sauce Labs.
2. **Upload the app binary** to the provider first (via their CLI/API or a CI step) and reference the returned app ID in the capability, since cloud providers don't read a local `.apk`/`.app` path directly.
3. **Swap the WebdriverIO service and connection details**, replacing `@wdio/appium-service` (which spawns a local Appium server) with the provider's WebdriverIO service (`@wdio/browserstack-service` or `@wdio/sauce-service`), which points the session at the provider's remote Appium endpoint instead of `http://127.0.0.1:4723`.
4. **Store credentials as environment variables/CI secrets** (e.g. `BROWSERSTACK_USERNAME`/`BROWSERSTACK_ACCESS_KEY` or `SAUCE_USERNAME`/`SAUCE_ACCESS_KEY`), never hard-coded, and read them in `wdio.conf.ts` the same way `PLATFORM` is read today.
5. **Extend the existing platform switch** to a broader "target" switch (e.g. `TARGET=local|browserstack|saucelabs`) so `wdio.conf.ts` picks not just Android vs iOS capabilities, but also local vs. cloud capabilities/services — following the same isolation pattern already used for Android/iOS, just one more axis of branching in the same place.
6. **Rely on the provider's dashboard for reporting** (video, device logs, network logs) as a complement to the local Allure report, since cloud providers capture richer device-level diagnostics than a local emulator run typically does.

No changes would be needed to `test/pageobjects/`, `test/specs/`, or the locator strategy — cloud execution is purely a capabilities/service/config concern in this architecture.

