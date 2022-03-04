const express = require("express");
const app = express();
const session = require("express-session");
const mongoose = require("mongoose");
const path = require("path");
const morgan = require("morgan");
const dotenv = require("dotenv").config();

const userRoutes = require("./routes/user");
const showRoutes = require("./routes/show");

mongoose
  .connect("mongodb://localhost:27017/Seen", { useNewUrlParser: true })
  .then(console.log("Mongo is Hot!"))
  .catch((error) => {
    console.log("Something is wrong");
    console.log(error);
  });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: "Your_Secret_Key",
    resave: true,
    saveUninitialized: true,
  })
);

// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Contro-Allow-Headers",
//         "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//     );
//     if (req.method === 'OPTIONS') {
//         res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
//         return res.status(200).json({});
//     }
//     next();
// });

app.use("/user", userRoutes);
app.use("/show", showRoutes);

app.use((req, res, next) => {
  const error = new Error("Not Found!");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
