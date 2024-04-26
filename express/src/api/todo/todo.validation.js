import Joi from "joi";

export const createTodoSchema = {
  body: Joi.object({
    task: Joi.string().required().trim().min(1).max(100),
  }),
};

export const updateTodoSchema = {
  params: Joi.object({
    id: Joi.number().required(),
  }),
  body: Joi.object({
    task: Joi.string().trim().min(1).max(100),
    isCompleted: Joi.bool(),
  }),
};

export const todoIdSchema = {
  params: Joi.object({
    id: Joi.number().required(),
  }),
};
