const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDb = require("./config/mongodb.js");
const authRouter = require("./routes/authRoute.js");
const otpRouter = require("./routes/otpRoute.js");
const cors = require("cors");
const app = express();

dotenv.config();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

if (process.env.Node_ENV !== "test") {
  connectDb();

  app.listen(port, function () {
    console.log("Example app listening on port 3000!");
  });
}

app.get("/", function (req, res) {
  res.send("Hello World!");
});

app.use("/api/auth", authRouter);
app.use("/api/otp", otpRouter);

module.exports = app;
