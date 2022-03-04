const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signUp = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exist",
        });
      } else {
        bcrypt.hash(req.body.password, 12, (err, hash) => {
          if (err) {
            res.status(500).json({
              message: "Password cannot be created :(",
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                console.log(result);
                res.status(201).json({
                  message: "User successfully created and stored in DB ;)",
                });
              })
              .catch((err) => {
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
};

exports.logIn = async (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(async (user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed",
        });
      } else {
        await bcrypt.compare(
          req.body.password,
          user[0].password,
          (err, result) => {
            if (err) {
              return res.status(401).json({
                message: "Auth failed",
              });
            }
            if (result) {
              const token = jwt.sign(
                {
                  email: user[0].email,
                  _id: user[0]._id,
                },
                process.env.JWT_KEY,
                {
                  expiresIn: "1h",
                }
              );
              return res.status(200).json({
                message: "Auth Success!",
                token: token,
              });
            }
            res.status(401).json({
              message: "Auth failed",
            });
          }
        );
      }
    })
    .catch((err) => {
      res.status(404).json({
        message:
          "No such user exist or you must have entered password/email wrong :(",
        error: err,
      });
    });
};

exports.remove = (req, res, next) => {
  User.remove({ _id: req.params.id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "User deleted!",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
