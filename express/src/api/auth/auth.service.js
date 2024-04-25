import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import _ from "lodash";
import { ERROR_CODES, TOKEN_TYPES } from "../../constants";
import { User } from "../../models";
import ApiError from "../../utils/api-error";

const SALT_FACTOR = 10;

export const authenticate = async (info) => {
  const { email, password } = info;
  const user = await User.findOne({ where: { email } });
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
  const user = await User.findOne({ where: { email } });
  if (user) {
    throw new ApiError({
      status: 400,
      code: ERROR_CODES.BAD_REQUEST,
      message: "User with this email address existed!",
    });
  }
  const salt = await bcrypt.genSalt(SALT_FACTOR);
  return User.create({
    name,
    email,
    password: await bcrypt.hash(password, salt),
  });
};

export const generateToken = (
  payload,
  expiresIn,
  secret = process.env.JWT_SECRET
) => {
  return jwt.sign(payload, secret, { algorithm: "HS256", expiresIn });
};

export const generateAccessToken = async (user) => {
  const payload = {
    type: TOKEN_TYPES.ACCESS,
    sub: user.id,
  };
  return generateToken(payload, process.env.ACCESS_TOKEN_TTL);
};

export const generateRefreshToken = async (user) => {
  const payload = {
    type: TOKEN_TYPES.REFRESH,
    sub: user.id,
  };
  const token = generateToken(payload, process.env.REFRESH_TOKEN_TTL);
  await User.update({ refreshToken: token }, { where: { id: user.id } });
  return token;
};

export const rotateRefreshToken = async (user, refreshToken) => {
  const userDoc = await User.findOne({ where: { refreshToken } });
  if (!userDoc)
    throw new ApiError({
      status: 401,
      code: ERROR_CODES.UNAUTHORIZED,
      message: "Invalid Token!",
    });
  const newToken = await generateRefreshToken(user);
  return newToken;
};

export const getUserInfo = async (userId) => {
  const user = await User.findByPk(userId);
  return _.omit(user.get({ plain: true }), "password", "refreshToken");
};
