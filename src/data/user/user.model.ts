import { Model } from 'mongoose';

export interface IUser {
  _id: string;

  created_at: Date;
  deleted_at: Date;
  updated_at: Date;

  first_name: string;
  last_name: string;
  middle_name: string;

  password: string;
  transaction_pin: string;

  email: string;
  phone_number: string;
  phone_meta?: PhoneMeta;

  dob: Date;
  gender: Gender;
  profile_picture?: string;

  devices: Device; // ideally should be a separate collection
  notification_channels: NotificationChannels;
}

export interface UserModel extends Model<IUser> {
  updatePassword: (plainText: string) => Promise<IUser>;
  isPasswordValid: (plainText: string) => Promise<Boolean>;

  updatePin: (plainText: string) => Promise<IUser>;
  isPinValid: (plainText: string) => Promise<Boolean>;
}

export type Gender = 'male' | 'female';

export interface NotificationChannels {
  sms: boolean;
  push: boolean;
  email: boolean;
}

export interface PhoneMeta {
  country: string;
  iso_code: string;
  prefix: string;
  local_number: string;
}

export interface Device {
  ios: string;
  android: string;
}

export interface SignupDTO {
  first_name: string;
  last_name: string;
  middle_name?: string;

  password: string;
  transaction_pin?: string;

  email?: string;
  phone_number?: string;

  dob: Date;
  gender: Gender;
  profile_picture?: string;
}

export interface LoginDTO {
  password: string;
  phone_number: string;
}
