import Error, { Selector } from "../misc/errors.js";

export default (...fields) =>
  (req, _, next) => {
    if (!req.body) return next(new Error(Selector.BAD_ERROR));

    for (const field of fields) {
      if (!req.body[field]) return next(new Error(Selector.BAD_INPUT));
    }

    next();
  };
