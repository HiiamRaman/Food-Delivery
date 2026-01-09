import dotenv from "dotenv";
dotenv.config({});
import { connectDb } from "./src/db/index.js";
import {app} from './app.js'
const port = process.env.PORT || 8000;


console.log("ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRET);
console.log("REFRESH_TOKEN_SECRET:", process.env.REFRESH_TOKEN_SECRET);

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
