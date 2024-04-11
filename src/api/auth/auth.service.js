import bcrypt from "bcryptjs";
import moment from "moment";
import jwt from "jsonwebtoken";
import _ from "lodash";
import { ERROR_CODES, TOKEN_TYPES } from "../../constants";
import { RefreshToken, User } from "../../models";
import ApiError from "../../utils/api-error";
import db from "../../db";

const SALT_FACTOR = 10;

export const authenticate = async (info) => {
  const { email, password } = info;
  const user = db.get('users').find({email}).value()
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
  const user = db.get('users').find({email}).value()
  if (user) {
    throw new ApiError({
      status: 400,
      code: ERROR_CODES.BAD_REQUEST,
      message: "User with this email address existed!",
    });
  }
  const salt = await bcrypt.genSalt(SALT_FACTOR);
  const newUser = new User(name, email, await bcrypt.hash(password, salt))
  await db.get('users').push(newUser).write()
  return newUser;
};

export const generateToken = (payload,secret = process.env.JWT_SECRET) => {
  return jwt.sign(payload, secret, { algorithm: "HS256" });
};

export const generateAccessToken = async (user) => {
  const expire = moment().add(process.env.ACCESS_TOKEN_TTL_SECONDS, "seconds");
  const payload = {
    iat: moment().unix(),
    exp: expire.unix(),
    sub: user.id,
  }
  return {accessToken: generateToken(payload), expire: payload.exp}
};

export const generateRefreshToken = async (user, grant_id = null) => {
  const expire = moment().add(process.env.REFRESH_TOKEN_TTL_HOURS, "hours");
  const payload = {
    iat: moment().unix(),
    exp: expire.unix(),
    sub: user.id,
  }
  const token = new RefreshToken(generateToken(payload), grant_id)
  await db.get('refresh_tokens').push(token).write()
  return {refreshToken : token.token, expire: payload.exp}
}

const revokeTokenFamily = (grantId) => {
  db.get('refresh_tokens').remove(e => e.grant_id == grantId).write()
}

export const rotateRefreshToken = async (user, refreshToken) => {
  const token = db.get('refresh_tokens').find({token: refreshToken})
  if(!token.value() || token.value().is_used){
    if(token.value()) await revokeTokenFamily(token.value().id)
    throw new ApiError({
      status: 400,
      code: ERROR_CODES.BAD_REQUEST,
      message: "Invalid token!",
    });
  }
  await token.assign({is_used: true}).write()
  return generateRefreshToken(user, token.value().grant_id ?? token.value().id)
}
export const getUserInfo = async(userId) => _.omit(await db.get('users').find({id: userId}).value(), 'password', 'created_at', 'id')
