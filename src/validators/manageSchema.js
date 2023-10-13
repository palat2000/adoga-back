const Joi = require("joi");

exports.roomSchema = Joi.object({
  maximumNumberPeople: Joi.number().required(),
  name: Joi.string().required(),
  desc: Joi.string().required(),
  price: Joi.number().required(),
  totalRoomCount: Joi.number().required(),
});

exports.changePasswordSchema = Joi.object({
  password: Joi.string()
    .pattern(/^[a-zA-Z0-9]{6,30}$/)
    .required()
    .trim(),
  newPassword: Joi.string()
    .pattern(/^[a-zA-Z0-9]{6,30}$/)
    .required()
    .trim(),
  confirmNewPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .trim()
    .required()
    .strip(),
});
