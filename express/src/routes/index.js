import express from "express";
import authRoute from "../api/auth/auth.route";
import todoRoute from "../api/todo/todo.route";
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../../swagger.json");

const swaggerUiOptions = {
  customCss:
    '@import url("https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"); *,html,body{font-family: "Inter", sans-serif !important;}',
};

const router = express.Router();

router.use("/auth", authRoute);
router.use("/todos", todoRoute);
router.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, swaggerUiOptions)
);

export default router;
