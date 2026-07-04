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
  //PARA LOCAL
  /*res.cookie("access_token", result.content, {
    expiresAt: new Date() + 3_600_000,
    httpOnly: true,
    secure: false, // true en prod
    sameSite: "none",  // obligatorio para cookies cross-site
    path: "/"
  });
  */

  //PARA PRODUCCION
  res.cookie("access_token", result.content, {
    expiresAt: new Date() + 3_600_000,
    httpOnly: true,
    secure: true, // true en prod
    sameSite: "none",  // obligatorio para cookies cross-site
    path: "/"
  });

  return res.status(200).json({
    success: true,
  });
};

export const logout = (req, res, next) => {
  //res.clearCookie("access_token"); para local

  res.clearCookie("access_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/"
  });

  return res.status(200).json({
    success: true,
  });
};
