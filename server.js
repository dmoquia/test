const express = require("express");
const app = express();
require("dotenv").config();
const dbConfig = require("./config/dbConfig");
const path = require("path");
app.use(express.json());

app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/admin", require("./routes/adminRoute"));
app.use("/api/doctor", require("./routes/doctorsRoute"));
const port = process.env.PORT || 5000;

// this configuration code that well help us deploy to heroku
if (process.env.NODE_ENV === "production") {
  app.use("/", express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client/build/index.html"));
  });
}
// end of this configuration code that well help us deploy to heroku
app.listen(port, () => {
  console.log(`server is runnong on port ${port}`);
});
