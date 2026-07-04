import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import mongoose from "mongoose";
import env from "../misc/constants.js";

const adapter = new PrismaPg({ connectionString: env.DB_URL });
export const prisma = new PrismaClient({ adapter });

export const mongoDB = async () => {
  await mongoose.connect(env.MONGO_URI);
  console.log("> connected succesfully to mongo!");
};
