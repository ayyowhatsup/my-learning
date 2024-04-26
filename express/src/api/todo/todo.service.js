import httpStatus from "http-status";
import { ERROR_CODES } from "../../constants";
import { Todo } from "../../models";
import ApiError from "../../utils/api-error";
import { Op } from "sequelize";
export function getUserTodos(user) {
  return Todo.findAll({ where: { userId: user.id } });
}

export async function createTodo(user, createTodoDto) {
  return Todo.create({ userId: user.id, ...createTodoDto });
}

export async function getSingleUserTodo(user, todoId) {
  const todo = await Todo.findOne({
    where: { [Op.and]: [{ userId: user.id, id: todoId }] },
  });
  if (!todo)
    throw new ApiError({
      status: httpStatus.BAD_REQUEST,
      code: ERROR_CODES.BAD_REQUEST,
      message: "Todo not found!",
    });
  return todo;
}

export async function editTodo(user, todoId, newContent) {
  const todo = await Todo.findOne({ where: { id: todoId, userId: user.id } });
  if (!todo)
    throw new ApiError({
      status: httpStatus.BAD_REQUEST,
      code: ERROR_CODES.BAD_REQUEST,
      message: "Todo not found!",
    });
  return todo.update({ ...newContent }, { where: { id: todoId } });
}

export async function deleteTodo(user, todoId) {
  const todo = await Todo.findOne({ where: { id: todoId, userId: user.id } });
  if (!todo)
    throw new ApiError({
      status: httpStatus.BAD_REQUEST,
      code: ERROR_CODES.BAD_REQUEST,
      message: "Todo not found!",
    });
  await todo.destroy();
}
