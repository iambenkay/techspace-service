const { default: ShortId } = require("short-unique-id");

const shortId = new ShortId();

function generate() {
  return shortId();
}

module.exports = {
  generate,
};
