import server from "./src/app.js";
import { mongoDB } from "./src/db/config.js";
import env from "./src/misc/constants.js";

server.listen(env.PORT, async () => {
  try {
    console.log(`> [:${env.PORT}] server listening`);
    await mongoDB();
  } catch (error) {
    console.log("> error connecting with mongo", error.message);
    process.exit(1);
  }
});
