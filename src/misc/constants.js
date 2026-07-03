const PORT = process.env.PORT;
const DB_URL = process.env.DATABASE_URL;
const SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_DB_URI;

export default {
  PORT,
  DB_URL,
  SECRET,
  MONGO_URI,
};
