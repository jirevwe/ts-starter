import crypto from 'crypto';
import { promisify } from 'util';

/**
 * Checks if a given account number, which is a phone number in this case has a missing leading 0 which is usually caused by the phone number being trimmed to 10 characters to meet the standard for most banking applications.
 * If it is it adds the leading 0, else it returns it as is.
 * @param phone_number The account number to be sanitized
 */
export const normalizeAccountNumber = (phone_number: string) => {
  const accountNumber =
    phone_number.length === 13 ? phone_number.slice(3) : phone_number;
  return /^[7-9][0-1][0-9]{8}/i.test(accountNumber)
    ? `0${accountNumber}`
    : accountNumber;
};

/**
 * Unwraps a service API response and returns the actual data
 * @param promise The request promise
 */
export const getResponseData = async <T = any>(promise: Promise<any>) => {
  const res = await promise;
  return res.data.data as T;
};

/**
 * Generates random bytes
 */
export const genRandomBytes = promisify(crypto.randomBytes);

/**
 * Generates random digits of a specified length
 * @param length The amount of random digits to generate and return
 */
export const randomDigits = (length: number) => {
  const digits = Array.from({ length }).reduce((prev, curr) => {
    return prev + String(Math.floor(Math.random() * 9));
  }, '') as string;

  return digits;
};

/**
 * Converts Kobo to Naira and converts it to human readable format e.g 300000 -> 3,000
 * @param koboAmount
 */
export const toNaira = (koboAmount: number) =>
  (koboAmount / 100).toLocaleString();

/**
 * Converts a number to a human readable amount and returns a string prefixed with the Naira symbol and the amount.
 * @param amount The amount to convert.
 */
export const humanReadableAmount = (amount: number) =>
  `\u20A6${toNaira(amount)}`;

/**
 * Splits a string using white-space. It first trims the string,
 * then uses regex to replace occurneces of multiple whitespace characters in the middle of the string
 * @param str the string to split
 */
export const extractFirstLastName = (str: string): string[] => {
  const [first_name, ...rest] = str
    .trim()
    .replace(/([ ,])+/g, ' ')
    .split(' ');

  return [first_name, rest.join(' ')];
};
