const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDb = async () => {
  mongoose.connection.on("connected", () => {
    console.log("Database connected");
  });
  await mongoose.connect(`${process.env.MONGODB_URI}auth`);
};

module.exports = connectDb;
