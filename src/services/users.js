import { prisma } from "../db/config.js";

export const selectFullUser = async ({ email, role }) => {
  try {
    const user = await prisma.user.findUnique({
      select: { username: true, bio: true },
      where: { email },
    });

    return {
      ok: true,
      content: { email, role, ...user },
    };
  } catch (error) {
    console.log("> error querying full user:", error.message);
    return {
      ok: false,
    };
  }
};

export const selectAllUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      omit: { id: true, password: true },
    });

    return {
      ok: true,
      content: users,
    };
  } catch (error) {
    console.log("> error querying users list:", error.message);
    return {
      ok: false,
    };
  }
};
