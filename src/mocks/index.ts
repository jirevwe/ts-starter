import faker from 'faker';
import { AxiosResponse } from 'axios';
import gateman from '../server/gateman';

/**
 * Generates a fake Nigerian phone number.
 * 2 & 7 are excluded from 0702 because the generated number acts funny at times
 */
export function generatePhoneNumber() {
  return faker.phone.phoneNumber(
    faker.random.arrayElement([
      `070${faker.random.arrayElement([0, 1, 3, 4, 5, 6, 8, 9])}#######`,
      `08${faker.random.number(1)}${faker.random.number({
        min: 2,
        max: 8
      })}#######`,
      `090${faker.random.number({ min: 1, max: 9 })}#######`
    ])
  );
}

/**
 * Create Mock User Payload.
 */
export function createMockUserPayload() {
  return {
    dob: faker.date.past(1993),
    gender: faker.random.arrayElement(['male', 'female']),
    email: faker.internet.email(),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    password: faker.internet.password(),
    phone_number: generatePhoneNumber()
  };
}

/**
 * Unwraps an Axios API response and returns the actual data. Used for calls made with Axios
 * @param promise The request promise
 */
export const getAxiosData = async <T = any>(promise: Promise<AxiosResponse>) =>
  (await promise).data.data as T;

/**
 * Creates a token for an user during tests
 * @param id the user's id
 */
export async function createAuthToken(id: string) {
  return await gateman.createSession({ id, role: 'user' });
}
