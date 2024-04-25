import * as AuthService from "./auth.service";
import catchAsync from "../../utils/catch-async";

export const register = catchAsync(async (req, res, next) => {
  const info = req.body;
  await AuthService.createUser(info);
  return next({ message: `Welcome to the website!` });
});

export const login = catchAsync(async (req, res, next) => {
  const info = req.body;
  const user = await AuthService.authenticate(info);
  return next({
    message: "Welcome to the website!",
    data: {
      accessToken: await AuthService.generateAccessToken(user),
      refreshToken: await AuthService.generateRefreshToken(user),
    },
  });
});

export const userInfo = async (req, res, next) => {
  const user = await AuthService.getUserInfo(req.user.id);
  return next({ data: user });
};

export const refresh = catchAsync(async (req, res, next) => {
  const refreshToken = req.user.token;
  const token = await AuthService.rotateRefreshToken(req.user, refreshToken);
  const accessToken = await AuthService.generateAccessToken(req.user);
  return next({ data: { accessToken, refreshToken: token } });
});
