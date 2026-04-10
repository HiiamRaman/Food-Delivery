import dotenv from "dotenv";
dotenv.config({});
import { connectDb } from "./src/db/index.js";
import { app } from "./app.js";
import mongoose from "mongoose";
const port = process.env.PORT || 8000;




// mongodb connection
connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(` app listening on port http://localhost:${port}`);
      console.log("DB NAME:", mongoose.connection.name);
    });
  })
  .catch((error) => {
    console.log("Mongodb connection Error", error);
    process.exit(1);
  });
