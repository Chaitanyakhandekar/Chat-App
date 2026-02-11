import connectDB from "./src/db/db.js"
import {httpServer} from "./server.js";
import { initializeSocket } from "./src/sockets/index.js";
import { redis } from "./src/redis/config.js";

connectDB().then(async () => {
  initializeSocket(); // Initialize socket handlers
  
  httpServer.listen(3000, async () => {
    console.log("Server is running on port 3000");
  });
});
