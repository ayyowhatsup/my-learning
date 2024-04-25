import { Sequelize } from "sequelize";
import logger from "../utils/logger";

require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: logger.info.bind(logger),
  define: {
    underscored: true,
  },
});

export default sequelize;
