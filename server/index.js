import connectDB from "./src/db/db.js"
import server from "./server.js";
import "./src/sockets/index.js";  // Initialize socket handlers

connectDB().then(async () => {
  
  server.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
});