import { DataTypes } from "sequelize";
import sequelize from "../db";
import User from "./user.model";

const Todo = sequelize.define("Todo", {
  task: DataTypes.STRING(100),
  isCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

User.hasMany(Todo, { foreignKey: "userId" });
Todo.belongsTo(User, { foreignKey: "userId" });

export default Todo;
