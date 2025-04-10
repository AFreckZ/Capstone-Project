//require("dotenv").config()
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db")
//middleware
app.use(express.json());//Access Body of client
app.use(cors());

//Routes
//register
app.use("/auth",require("./routes/jwtAuth"))

app.listen(5000, () => {
    console.log("server is running on port 5000")
})