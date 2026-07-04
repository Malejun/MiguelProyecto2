import Error, { Selector } from "../misc/errors.js";
import { insertUser, selectUser } from "../services/auth.js";

export const register = async (req, res, next) => {
  const { username, email, password, role, bio } = req.body;

  const result = await insertUser({ username, email, password, role, bio });

  if (!result.ok) return next(new Error(Selector.BAD_ERROR));

  return res.status(200).json({
    success: true,
  });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  const result = await selectUser({ email, password });

  if (!result.ok) return next(new Error(Selector.WRONG_CRED));

  res.cookie("access_token", result.content, {
    expiresAt: new Date() + 3_600_000,
    httpOnly: true,
    secure: true, // true en prod
  });

  return res.status(200).json({
    success: true,
  });
};

export const logout = (req, res, next) => {
  res.clearCookie("access_token");

  return res.status(200).json({
    success: true,
  });
};
