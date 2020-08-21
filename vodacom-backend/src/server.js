const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const V = require("./services/validator");
const store = require("./services/upload-provider");
const path = require("path");
const c = require("./data/collections");

const { processCookieToken } = require("./middleware");

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

app.get("/media/*", async (req, res) => {
  const key = req.originalUrl.split("/media/")[1];
  let file;
  try {
    file = await store.fetch(key);
    res.status(200).send(file.data);
  } catch (e) {
    res.status(404).send();
  }
});

app.get("/m/:key", processCookieToken, async (req, res) => {
  const { key } = req.params;
  const id = req.payload && req.payload.id;

  const media = await c.media.find({ code: key });
  if (media.owners && media.owners.length > 0) {
    if (!media.owners.includes(id)) {
      res.status(404).send();
    }
  }
  let file;
  try {
    file = await store.fetch(media.key);
    res.status(200).send(file.data);
  } catch (e) {
    res.status(404).send();
  }
});

app.get("/*", (_, res) => {
  return res.sendFile(path.resolve("./static/index.html"));
});

module.exports = app;
