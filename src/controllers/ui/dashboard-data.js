const express = require("express");
const c = require("../../data/collections");
const { Response, ResponseError } = require("../../utils");

/**
 * @param {express.request} request
 * @returns {Response}
 * @throws {ResponseError}
 */
module.exports.vendor = async request => {
  const { id } = request.payload;

  const account = await c.accounts.find({ _id: id });

  const no_of_unread_notifications = (
    await c.notifications.findAll({ user: id, read: false })
  ).length;
  const no_of_approved_businesses_tied_to = (
    await c.business_vendor_rel.findAll({ vendorId: id, accepted: true })
  ).length;
  const no_of_pending_businesses_tied_to = (
    await c.business_vendor_rel.findAll({ vendorId: id, accepted: false })
  ).length;
  const inventory_stats = (await c.inventory.findAll({ vendorId: account.id }))
    .length;

  delete account.password;
  return new Response(200, {
    error: false,
    account: {
      name: account.name,
      email: account.email
    },
    extras: {
      no_of_approved_businesses_tied_to,
      no_of_pending_businesses_tied_to,
      no_of_unread_notifications,
      inventory_stats
    }
  });
};

/**
 * @param {express.request} request
 * @returns {Response}
 * @throws {ResponseError}
 */
module.exports.business = async request => {
  const { id } = request.payload;

  const account = await c.accounts.find({ _id: id });

  const no_of_unread_notifications = (
    await c.notifications.findAll({ user: id, read: false })
  ).length;
  const no_of_pending_vendors_linked_to = (
    await c.business_vendor_rel.findAll({ businessId: id, accepted: false })
  ).length;
  const no_of_accepted_vendors_linked_to = (
    await c.business_vendor_rel.findAll({ businessId: id, accepted: true })
  ).length;
  const no_of_pending_admins = (await c.business_admin_rel.findAll({ businessId: id, accepted: false }))
    .length;
  const no_of_approved_admins = (await c.business_admin_rel.findAll({ businessId: id, accepted: true }))
    .length;
  const no_of_rfqs = (await c.rfq.findAll({ initiator: id })).length;

  delete account.password;
  return new Response(200, {
    error: false,
    account: {
      name: account.name,
      email: account.email
    },
    extras: {
      no_of_pending_admins,
      no_of_approved_admins,
      no_of_unread_notifications,
      no_of_pending_vendors_linked_to,
      no_of_accepted_vendors_linked_to,
      no_of_rfqs,
    }
  });
};

/**
 * @param {express.request} request
 * @returns {Response}
 * @throws {ResponseError}
 */
module.exports.regular = async request => {
  const { id } = request.payload;

  const account = await c.accounts.find({ _id: id });

  const no_of_unread_notifications = (
    await c.notifications.findAll({ user: id, read: false })
  ).length;
  const no_of_vendors_linked_to = (
    await c.business_vendor_rel.findAll({
      vendorId: account.id,
      accepted: true
    })
  ).length;
  const no_of_rfqs = (await Rfq.findAll({ initiator: account.businessId }))
    .length;

  delete account.password;
  return new Response(200, {
    error: false,
    account: {
      name: account.name,
      email: account.email
    },
    extras: {
      no_of_admins,
      no_of_unread_notifications,
      no_of_vendors_linked_to,
      no_of_rfqs
    }
  });
};
