import { isAndroid } from '../utils/platform.js';

export default class Page {
    public async scrollToElement (scrollableLocator: string, targetLocator: string, maxScrolls = 10) {
        const target = await $(targetLocator);

        await target.scrollIntoView({
            direction: 'up',
            maxScrolls,
            scrollableElement: $(scrollableLocator)
        });

        return target;
    }

    public async scrollToEnd (scrollableLocator: string, maxScrolls = 10) {
        const scrollableElement = await $(scrollableLocator);
        const elementId = (scrollableElement as unknown as { elementId: string }).elementId;

        for (let i = 0; i < maxScrolls; i++) {
            const sourcePageSource = await driver.getPageSource();
            if (isAndroid()) {
                await browser.execute('mobile: scrollGesture', {
                    elementId,
                    direction: 'up',
                    percent: 0.8
                });
            } else {
                await browser.execute('mobile: scroll', {
                    elementId,
                    direction: 'up'
                });
            }
            const targetPageSource = await driver.getPageSource();
            if (sourcePageSource === targetPageSource) {
                break;
            }
        }
    }

}
