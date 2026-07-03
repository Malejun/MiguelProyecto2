import Error, { Selector } from "../misc/errors.js";
import { verify } from "../utils/jwt.js";

export default (req, res, next) => {
  
  const { access_token: accessToken } = req.cookies;
  const user = verify(accessToken);

  if (!user) return next(new Error(Selector.UNAUTHORIZED));

  const { id, email, role } = user;
  res.locals = { id, email, role };
 
  next();
};
