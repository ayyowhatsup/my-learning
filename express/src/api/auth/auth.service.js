import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import _ from "lodash";
import { ERROR_CODES, TOKEN_TYPES } from "../../constants";
import { RefreshToken, User } from "../../models";
import ApiError from "../../utils/api-error";
import db from "../../db";
import { default as redisClient } from "../../db";

const SALT_FACTOR = 10;

export const authenticate = async (info) => {
  const { email, password } = info;
  const user = db.get("users").find({ email }).value();
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError({
      status: 400,
      code: ERROR_CODES.BAD_REQUEST,
      message: "Email or password is not correct!",
    });
  }
  return user;
};

export const createUser = async (info) => {
  const { name, email, password } = info;
  const user = db.get("users").find({ email }).value();
  if (user) {
    throw new ApiError({
      status: 400,
      code: ERROR_CODES.BAD_REQUEST,
      message: "User with this email address existed!",
    });
  }
  const salt = await bcrypt.genSalt(SALT_FACTOR);
  const newUser = new User(name, email, await bcrypt.hash(password, salt));
  await db.get("users").push(newUser).write();
  return newUser;
};

export const generateToken = (
  payload,
  expiresIn,
  secret = process.env.JWT_SECRET
) => {
  return jwt.sign(payload, secret, { algorithm: "HS256", expiresIn });
};

export const generateAccessToken = async (user, grantId = undefined) => {
  const payload = {
    type: TOKEN_TYPES.ACCESS,
    sub: user.id,
    iss: grantId,
  };
  return generateToken(payload, process.env.ACCESS_TOKEN_TTL);
};

export const generateRefreshToken = async (user, grantÍd = undefined) => {
  const payload = {
    type: TOKEN_TYPES.REFRESH,
    sub: user.id,
    iss: grantÍd,
  };
  const token = new RefreshToken(
    generateToken(payload, process.env.REFRESH_TOKEN_TTL),
    grantÍd
  );
  await db.get("refresh_tokens").push(token).write();
  return token.token;
};

const revokeTokenFamily = (grantId) => {
  db.get("refresh_tokens")
    .remove((e) => e.grant_id == grantId)
    .write();
  // block grant_id until expiration
  redisClient.set(`bl_${grantId}`, true).write();
};

export const rotateRefreshToken = async (user, refreshToken) => {
  const token = db.get("refresh_tokens").find({ token: refreshToken });
  const tokenValue = token.value();
  const grantId = tokenValue.grant_id ?? tokenValue.id;
  if (!tokenValue || tokenValue.is_used) {
    if (tokenValue) {
      revokeTokenFamily(grantId);
    }
    throw new ApiError({
      status: 401,
      code: ERROR_CODES.UNAUTHORIZED,
      message: "Authentication required!",
    });
  }
  await token.assign({ is_used: true }).write();
  const newToken = await generateRefreshToken(user, grantId);
  return { token: newToken, grantId };
};

export const getUserInfo = async (userId) =>
  _.omit(
    await db.get("users").find({ id: userId }).value(),
    "password",
    "created_at",
    "id"
  );
