const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const dbConnect = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Database connected successfully");
};

module.exports = dbConnect;