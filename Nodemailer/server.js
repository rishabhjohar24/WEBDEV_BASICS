const express = require("express");
const app = express();
const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Contro-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET");
    return res.status(200).json({});
  }
  next();
});

app.get("/", (req, res) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.FROM,
      pass: process.env.Password,
    },
  });
  const mailOptions = {
    from: process.env.FROM,
    to: "recieveremail",
    subject: "Mail for guidance!",
    html: `<div>
              <h1>Mail from ${req.body.name}</h1>
              <h2>My contact information</h2>
              <p> Email: ${req.body.email}</p>
              <p> Phone: ${req.body.phone}</p>
              </br>
              <p>Hi i'm ${req.body.name} from <strong>${req.body.city} </strong> and completed my education in the ${req.body.school}</p>
              <p>Description: ${req.body.description}</p>
          </div>`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      res.send(error);
    } else {
      console.log("Email sent: " + info.response);
      res.send({ responseCode: 200 });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
