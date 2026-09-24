import testData from './testData.json' with { type: 'json' };

export interface Credentials {
    username: string;
    password: string;
}

type Users = typeof testData.users;
type UserKey = keyof Users;

type Products = typeof testData.products;
type ProductKey = keyof Products;

export function getCredentials(userKey: UserKey): Credentials {
    const user = testData.users[userKey];

    if (!user) {
        throw new Error(`No credentials found in testData.json for user "${String(userKey)}"`);
    }

    return user;
}

export function getProductName(productKey: ProductKey): string {
    const product = testData.products[productKey];

    if (!product) {
        throw new Error(`No product found in testData.json for key "${String(productKey)}"`);
    }

    return product;
}
