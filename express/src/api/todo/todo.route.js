import { Router } from "express";
import * as TodoController from "./todo.controller";
import requireAuthToken from "../../middlewares/require-auth";
import validateSchema from "../../middlewares/schema-validator";
import { TOKEN_TYPES } from "../../constants";
import {
  createTodoSchema,
  todoIdSchema,
  updateTodoSchema,
} from "./todo.validation";

const router = Router();

router
  .route("/")
  .all(requireAuthToken(TOKEN_TYPES.ACCESS))
  .get(TodoController.getTodos)
  .post(validateSchema(createTodoSchema), TodoController.createTodo);

router
  .route("/:id")
  .all(requireAuthToken(TOKEN_TYPES.ACCESS))
  .get(validateSchema(todoIdSchema), TodoController.getUserTodo)
  .delete(validateSchema(todoIdSchema), TodoController.deleteTodo)
  .patch(validateSchema(updateTodoSchema), TodoController.patchTodo);

export default router;
