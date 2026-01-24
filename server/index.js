import connectDB from "./src/db/db.js"
import {httpServer} from "./server.js";
import { initializeSocket } from "./src/sockets/index.js";

connectDB().then(async () => {
  initializeSocket(); // Initialize socket handlers
  
  httpServer.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
});