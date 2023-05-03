//https://www.youtube.com/watch?v=HGgyd1bYWsE



const express = require("express");
const app = express();
const db = require("./database.js");
const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");

const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT || 5000;


//THE CONNECTION TO DATABASE
db();

//MIDDELWARE
app.use(cors());
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);

 
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

