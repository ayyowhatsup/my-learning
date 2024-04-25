import Joi from "joi";

export const loginSchema = {
  body: Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().min(8).max(30).label("Password"),
  }),
};

export const registerSchema = {
  body: Joi.object({
    name: Joi.string().min(2).required().label("Name"),
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().min(8).max(30).label("Password"),
    repeat_password: Joi.any()
      .equal(Joi.ref("password"))
      .required()
      .label("Repeat password")
      .messages({ "any.only": "{{#label}} does not match" }),
  }),
};
