const app = require("./server");
require("dotenv").config();

const { PORT = 3000, HOST = "0.0.0.0" } = process.env;

app.listen();

app.listen(PORT, HOST, () => {
  console.log(`HTTP server started on port ${PORT}`);
});
