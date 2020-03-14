const express = require("express")
const Collection = require("../../data/orm")
const { Response, ResponseError } = require("../../utils")
const Account = Collection("accounts")
const Business_Vendor_Rel = Collection("business-vendor-rel")
const Notifications = Collection("notifications")
const Rfq = Collection("rfqs")

/**
 * @param {express.request} request
 * @returns {Response}
 * @throws {ResponseError}
 */
module.exports.vendor = async request => {
    const { id } = request.payload

    const account = await Account.find({ _id: id })

    const no_of_unread_notifications = (await Notifications.findAll({ user: id, read: false })).length
    const no_of_businesses_tied_to = (await Business_Vendor_Rel.findAll({ vendorId: id, accepted: true })).length

    delete account.password
    return new Response(200, {
        error: false,
        account: {
            name: account.name,
            email: account.email
        },
        extras: {
            no_of_businesses_tied_to,
            no_of_unread_notifications,
        }
    })
}

/**
 * @param {express.request} request
 * @returns {Response}
 * @throws {ResponseError}
 */
module.exports.business = async request => {
    const { id } = request.payload

    const account = await Account.find({ _id: id })

    const no_of_unread_notifications = (await Notifications.findAll({ user: id, read: false })).length
    const no_of_vendors_linked_to = (await Business_Vendor_Rel.findAll({ businessId: id, accepted: true })).length
    const no_of_admins = (await Account.findAll({ businessId: id, userType: "regular-admin" })).length
    const no_of_rfqs = (await Rfq.findAll({ initiator: id })).length

    delete account.password
    return new Response(200, {
        error: false,
        account,
        extras: {
            no_of_admins,
            no_of_unread_notifications,
            no_of_vendors_linked_to,
            no_of_rfqs
        }
    })
}

/**
 * @param {express.request} request
 * @returns {Response}
 * @throws {ResponseError}
 */
module.exports.regular = async request => {
    const { id } = request.payload

    const account = await Account.find({ _id: id })

    const no_of_unread_notifications = (await Notifications.findAll({ user: id, read: false })).length
    const no_of_vendors_linked_to = (await Business_Vendor_Rel.findAll({ businessId: account.businessId, accepted: true })).length
    const no_of_rfqs = (await Rfq.findAll({ initiator: account.businessId })).length

    delete account.password
    return new Response(200, {
        error: false,
        account,
        extras: {
            no_of_admins,
            no_of_unread_notifications,
            no_of_vendors_linked_to,
            no_of_rfqs
        }
    })
}
