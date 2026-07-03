import jwt from "jsonwebtoken";
import env from "../misc/constants.js";

export const sign = (payload) => {
  return jwt.sign(payload, env.SECRET, { expiresIn: "1h" });
};

export const verify = (token) => {
  try {
    return jwt.verify(token, env.SECRET);
  } catch (error) {
    console.log("> error veryfing jwt:", error.message);
    return false;
  }
};
