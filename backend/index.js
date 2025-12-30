import express from "express";
import { connectDb } from "./src/db/index.js";
import dotenv from 'dotenv'
dotenv.config({});

const app = express()
const port = process.env.PORT || 8000



// mongodb connection
connectDb()
app.get('/', (req, res) => {
  res.send('Hello Raman !')
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
