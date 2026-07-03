import bcrypt from "bcrypt";

const ROUNDS = 10;

export const crypt = async (password) => {
  const salt = await bcrypt.genSalt(ROUNDS);
  return await bcrypt.hash(password, salt);
};

export const compare = async (plain, hashed) => {
  return await bcrypt.compare(plain, hashed);
};
