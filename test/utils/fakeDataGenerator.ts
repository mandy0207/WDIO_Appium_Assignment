import { faker } from '@faker-js/faker';
import { CheckoutFormData } from '../types.js';

export function generateCheckoutFormData(): CheckoutFormData {
    return {
        fullName: faker.person.fullName(),
        address1: faker.location.streetAddress(),
        address2: faker.location.secondaryAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zip: faker.location.zipCode(),
        country: faker.location.country(),
        cardNumber: faker.finance.creditCardNumber(),
        expirationDate: formatAsDdMm(faker.date.future()),
        securityCode: faker.finance.creditCardCVV()
    };
}

function formatAsDdMm(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}${month}`;
}
