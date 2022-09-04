const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL);

const connection = mongoose.connection;

connection.on("connected", () => {
  console.log("MongoDB connected Successfully");
});
connection.on("error", (error) => {
  console.log("Error connecting in mongodb"), error;
});

module.exports = mongoose;
