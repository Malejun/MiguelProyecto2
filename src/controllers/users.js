import Error, { Selector } from "../misc/errors.js";
import { selectAllUsers, selectFullUser } from "../services/users.js";

export const getProfile = async (req, res, next) => {
  const { email, role } = res.locals;

  const result = await selectFullUser({ email, role });

  if (!result.ok) return next(new Error(Selector.BAD_ERROR));

  return res.status(200).json({
    success: true,
    data: result.content,
  });
};

export const getUsers = async (req, res, next) => {
  const result = await selectAllUsers();

  if (!result.ok) return next(new Error(Selector.BAD_ERROR));

  return res.status(200).json({
    success: true,
    data: result,
  });
};
