const Joi = require("joi");

const userScheme = Joi.object({
  firstName: Joi.string().min(3).required(),
  lastName: Joi.string().min(3).required(),
  age: Joi.number().required(),
  city: Joi.string().min(1),
});

const idScheme = Joi.object({
  id: Joi.number().required(),
});

module.exports = { userScheme, idScheme };
