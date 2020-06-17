const app = require("./server");
require("dotenv").config();
const { readFileSync } = require("fs");

const http = require("http");
const https = require("https");

const { HTTP_PORT = 3000, HTTPS_PORT = 3001, HOST = "0.0.0.0" } = process.env;

const options = {
  key: readFileSync("certificates/cert.key"),
  cert: readFileSync("certificates/cert.pem"),
};

http
  .createServer((req, res) => {
    res.writeHead(307, {
      Location: `https://${req.headers["host"]}${req.url}`,
    });
    res.end();
  })
  .listen(HTTP_PORT, () => {
    console.log(`HTTP Server started on port ${HTTP_PORT}`);
  });

https.createServer(options, app).listen(HTTPS_PORT, () => {
  console.log(`HTTPS Server started on port ${HTTPS_PORT}`);
});
