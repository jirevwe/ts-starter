import env from '@app/common/config/env';
import { PinNotSetError } from '@app/common/errors';
import { SchemaTypes, Document } from 'mongoose';
import { IUser } from '.';
import { SchemaFactory, trimmedString } from '../base';
import bcrypt from 'bcrypt';

type UserDocument = IUser & Document<any, any, IUser>;

const UserSchema = SchemaFactory<IUser>({
  email: { ...trimmedString },
  phone_number: { ...trimmedString, unique: true, index: true, required: true },
  password: { ...trimmedString, required: true, select: false },
  transaction_pin: { ...trimmedString, select: false },

  first_name: { ...trimmedString, required: true },
  last_name: { ...trimmedString },
  middle_name: { ...trimmedString },

  profile_picture: { ...trimmedString },
  gender: { ...trimmedString, enum: ['male', 'female'] },
  dob: { type: SchemaTypes.Date },
  devices: {
    ios: { type: SchemaTypes.String },
    android: { type: SchemaTypes.String }
  },

  notification_channels: {
    sms: { type: SchemaTypes.Boolean, default: false },
    email: { type: SchemaTypes.Boolean, default: true },
    push: { type: SchemaTypes.Boolean, default: true }
  },
  phone_meta: {
    country: { type: SchemaTypes.String },
    iso_code: { type: SchemaTypes.String },
    prefix: { type: SchemaTypes.String },
    local_number: { type: SchemaTypes.String }
  }
});

/**
 * Mongoose Pre-save hook used to hash passwords for new users
 */
UserSchema.pre('save', async function () {
  const user = <UserDocument>this;
  if (!user.isNew) return;

  const hash = await bcrypt.hash(user.password, env.salt_rounds);
  user.password = hash;
});

/**
 * Document method used to check if a plain text password is the same as a hashed password
 * @param plainText Plain text to be hashed and set as the paswword
 */
UserSchema.method('isPasswordValid', async function (plainText: string) {
  const user = <IUser>this;
  const result = await bcrypt.compare(plainText, user.password);
  return result;
});

/**
 * Document method used to change a user's password.
 * @param plainText Plain text to be hashed and set as the paswword
 */
UserSchema.method('updatePassword', async function (plainText: string) {
  const user = <UserDocument>this;
  const hash = await bcrypt.hash(plainText, env.salt_rounds);
  user.password = hash;
  return await user.save();
});

/**
 * Document method used to check if a plain text password is the same as a hashed password
 * @param plainText Plain text to be hashed and set as the paswword
 */
UserSchema.method('isPinValid', async function (plainText: string) {
  const user = <UserDocument>this;
  if (!user.transaction_pin) throw new PinNotSetError();
  const result = await bcrypt.compare(plainText, user.transaction_pin);
  return result;
});

/**
 * Document method used to change a user's password.
 * @param plainText Plain text to be hashed and set as the paswword
 */
UserSchema.method('updatePin', async function (plainText: string) {
  const user = <UserDocument>this;
  const hash = await bcrypt.hash(plainText, env.salt_rounds);
  user.transaction_pin = hash;
  return await user.save();
});

export default UserSchema;
