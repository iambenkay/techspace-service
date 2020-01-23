const DB = require("./db")
const {Id} = require("../utils")

const insert = async data => {
    const db = await DB()
    const record = {
        _id: Id(),
        createdAt: Date.now(),
        isVerified: false,
        updatedAt: Date.now(),
        lastLogin: Date.now(),
        ...data
    }
    const result = await db
    .collection("accounts")
    .insertOne(record)

    const {_id: id, ...insertedData} = result.ops[0]

    return {
        id,
        ...insertedData
    }
}

const find = async query => {
    const db = await DB()
    const result = await db
    .collection("accounts")
    .find(query)
    const found = await result.toArray()
    if (found.length === 0) return null
    const {_id: id, ...data} = found[0]

    return {id, ...data}
}
const findAll = async query => {
    const db = await DB()
    const result = await db
    .collection("accounts")
    .find(query)
    const found = await result.toArray()
    return found.map(({_id: id, ...data}) => ({
        id,
        ...data
    }))
}

const update = async (query, update) => {
    const db = await DB()
    const result = await db
    .collection("accounts")
    .updateOne(query, {$set: update})
    return result.modifiedCount > 0 ? update : null
}

const remove = async query => {
    const db = await DB()
    const result = await db
    .collection("accounts")
    .deleteOne(query)

    return result.deletedCount
}

module.exports = Object.freeze({
    insert,
    find,
    findAll,
    remove,
    update
})