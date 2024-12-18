const dotenv = require("dotenv");
const cookieParser=require('cookie-parser');
dotenv.config();
const express = require("express");
const cors = require("cors");
const app = express();
const connectToDB=require('./db/db');
const userRoutes=require('./routes/user_route');




app.use(cors());
connectToDB();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use('/users',userRoutes);

module.exports = app; 
