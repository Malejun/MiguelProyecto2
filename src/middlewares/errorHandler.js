import Error from "../misc/errors.js";

export default (error, _, __, next) => {
  if (!(error instanceof Error)) return next(new Error(error));
  return next(error);
};
