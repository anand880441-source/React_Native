const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const connectDB = async () => {
  await mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => {
      console.log("MongoDB connected sucessfully!!");
    })
    .catch((err) => {
      console.log(err);
    });

};

module.exports = connectDB