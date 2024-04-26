import httpStatus from "http-status";
import * as TodoService from "./todo.service";
import catchAsync from "../../utils/catch-async";

export async function getTodos(req, res, next) {
  return next({ data: await TodoService.getUserTodos(req.user) });
}

export async function createTodo(req, res, next) {
  return next({ data: await TodoService.createTodo(req.user, req.body) });
}

export const getUserTodo = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  return next({ data: await TodoService.getSingleUserTodo(req.user, id) });
});
export const patchTodo = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  return next({ data: await TodoService.editTodo(req.user, id, req.body) });
});

export const deleteTodo = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  await TodoService.deleteTodo(req.user, id);
  return next({ status: httpStatus.NO_CONTENT });
});
