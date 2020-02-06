const DB = require("./db")
const { Id } = require("../utils")

module.exports = collection => {
    const insert = async data => {
        const db = await DB()
        const record = {
            _id: Id(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
            ...data
        }
        const result = await db
            .collection(collection)
            .insertOne(record)

        const { _id: id, ...insertedData } = result.ops[0]

        return {
            id,
            ...insertedData
        }
    }

    const find = async query => {
        const db = await DB()
        const result = await db
            .collection(collection)
            .find(query)
        const found = await result.toArray()
        if (found.length === 0) return null
        const { _id: id, ...data } = found[0]

        return { id, ...data }
    }
    const findAll = async query => {
        const db = await DB()
        const result = await db
            .collection(collection)
            .find(query)
        const found = await result.toArray()
        return found.map(({ _id: id, ...data }) => ({
            id,
            ...data
        }))
    }

    const update = async (query, update) => {
        const db = await DB()
        const result = await db
            .collection(collection)
            .updateOne(query, { $set: { updatedAt: Date.now(), ...update } })
        return result.modifiedCount > 0 ? update : null
    }

    const remove = async (query = {}) => {
        const db = await DB()
        const result = await db
            .collection(collection)
            .deleteMany(query)

        return result.deletedCount
    }

    return Object.freeze({
        insert,
        find,
        findAll,
        remove,
        update
    })
}