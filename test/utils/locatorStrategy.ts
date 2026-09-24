import { isAndroid } from './platform.js';

export function platformLocator(androidLocator: string, iosLocator: string): string {
    return isAndroid() ? androidLocator : iosLocator;
}
