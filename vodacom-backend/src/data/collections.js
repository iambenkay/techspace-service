const C = require("./orm");

module.exports = {
  accounts: C("accounts"),
  business_vendor_rel: C("business-vendor-rel"),
  notifications: C("notifications"),
  business_admin_rel: C("business-admin-rel"),
  inventory: C("inventory"),
  rfq: C("rfqs"),
  vendor_rfq_rel: C("vendor-rfq-rel"),
  message_head: C("message-head"),
  messages: C("messages"),
  archives: C("archives"),
  portfolio: C("portfolio"),
  media: C("media"),
};
