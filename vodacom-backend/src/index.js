const app = require("./server")
require("dotenv").config()

const { PORT = 3000 } = process.env

app.listen(PORT, () => {
    console.log(`HTTP server started on port ${PORT}`)
})