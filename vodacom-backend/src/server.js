const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const V = require("./services/validator");
const path = require("path");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, _, next) => {
  req.V = V;
  console.log(`${req.method} - ${req.url} ${_.statusCode}`);
  next();
});
app.use("/api/v1", require("./routes"));
app.get("/verify", require("./routes/verify"));
app.get("/vendor-invite", require("./routes/vendor-invite"));
app.get("/admin-invite", require("./routes/admin-invite"));
app.use(express.static("static"));

app.get("/*", (req, res) => {
  return res.sendFile(path.resolve("./static/index.html"));
});

module.exports = app;
