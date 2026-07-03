import { prisma } from "../db/config.js";
import { isString } from "../utils/common.js";
import { sign } from "../utils/jwt.js";
import { compare, crypt } from "../utils/password.js";

export const insertUser = async ({ password, ...user }) => {
  try {
    const hashedPassword = await crypt(isString(password));
    await prisma.user.create({ data: { ...user, password: hashedPassword } });

    return {
      ok: true,
    };
  } catch (error) {
    console.log("> error inserting user:", error.message);
    return {
      ok: false,
    };
  }
};

export const selectUser = async ({ email, password }) => {
  try {
    const user = await prisma.user.findUnique({
      select: { id: true, password: true, role: true },
      where: { email },
    });

    if (!user || !(await compare(isString(password), user.password)))
      throw new Error("user not found or incorrect password");

    return {
      ok: true,
      content: sign({ id: user.id, email, role: user.role }),
    };
  } catch (error) {
    console.log("> error querying user:", error.message);
    return {
      ok: false,
    };
  }
};
