const Joi = require("joi");

exports.registerSchema = Joi.object({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{6,30}$/)
    .trim()
    .required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .trim()
    .required()
    .strip(),
});

exports.loginSchema = Joi.object({
  mobileOrEmail: Joi.alternatives([
    Joi.string().email(),
    Joi.string().pattern(/^[0-9]{10}$/),
  ]).strip(),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{6,30}$/)
    .trim()
    .required(),
  mobile: Joi.forbidden().when("mobileOrEmail", {
    is: Joi.string().pattern(/^[0-9]{10}$/),
    then: Joi.string().default(Joi.ref("mobileOrEmail")),
  }),
  email: Joi.forbidden().when("mobileOrEmail", {
    is: Joi.string().email(),
    then: Joi.string().default(Joi.ref("mobileOrEmail")),
  }),
});

exports.registerPlaceSchema = Joi.object({
  name: Joi.string().trim().required(),
  type: Joi.string().required(),
  email: Joi.string().email().required(),
  mobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{6,30}$/)
    .required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .trim()
    .required()
    .strip(),
  lat: Joi.number().required(),
  lng: Joi.number().required(),
});
