import joi from 'joi';

export const signup = joi.object({
  dob: joi.date(),
  email: joi.string().email().trim(),
  password: joi
    .string()
    .trim()
    .regex(/[0-9]{4}/)
    .length(4)
    .required(),
  first_name: joi.string().trim().required(),
  middle_name: joi.string().trim(),
  gender: joi.string().trim(),
  last_name: joi.string().trim().required(),
  phone_number: joi.string().trim().required(),
  profile_picture: joi.string().uri().trim()
});

export const login = joi.object({
  phone_number: joi.string().trim().required(),
  password: joi
    .string()
    .trim()
    .regex(/[0-9]{4}/)
    .length(4)
    .required()
});
