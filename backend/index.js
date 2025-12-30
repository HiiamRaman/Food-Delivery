import { connectDb } from "./src/db/index.js";
import dotenv from "dotenv";
dotenv.config({});
import {app} from './app.js'
const port = process.env.PORT || 8000;

// mongodb connection
connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(` app listening on port http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log("Mongodb connection Error", error);
    process.exit(1);
  });
