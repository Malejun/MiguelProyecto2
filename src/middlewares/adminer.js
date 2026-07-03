import Error, { Selector } from "../misc/errors.js";

export default (req, res, next) => {
  const { role } = res.locals;

  if (role !== "ADMIN") return next(new Error(Selector.NOT_FOUND));

  next();
};
