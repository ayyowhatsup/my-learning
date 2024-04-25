import { DataTypes } from "sequelize";
import sequelize from "../db";

const User = sequelize.define("User", {
  email: {
    type: DataTypes.STRING(100),
    validate: {
      isEmail: true,
    },
  },
  name: DataTypes.STRING(50),
  password: DataTypes.STRING,
  refreshToken: DataTypes.STRING(256),
});

export default User;
