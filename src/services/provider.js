const cuid = require("cuid")

module.exports.Id = () => {
    return cuid()
}