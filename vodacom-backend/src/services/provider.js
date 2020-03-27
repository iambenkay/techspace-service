const cuid = require("cuid");
const c = require("crypto");
const PubNub = require("pubnub");

module.exports.Id = () => cuid();

module.exports.RndToken = () => c.randomBytes(16).toString("hex");

module.exports.pubnub = new PubNub({
  publishKey: process.env.PUBNUB_PUB_KEY,
  subscribeKey: process.env.PUBNUB_SUB_KEY,
  ssl: true
});
