const DB = require("./db");
const { Id } = require("../services/provider");

module.exports = (collection) => {
  const insert = async ({ _id = Id(), ...data }) => {
    const db = await DB();
    const record = {
      _id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...data,
    };
    const result = await db.collection(collection).insertOne(record);

    const { _id: id, ...insertedData } = result.ops[0];

    return {
      id,
      ...insertedData,
    };
  };
  const findFactory = async (query = {}, sort = null, limit = null) => {
    const db = await DB();
    const result = await db
      .collection(collection)
      .find(query)
      .sort(sort)
      .limit(limit);
    const found = await result.toArray();
    return found.map(({ _id: id, ...data }) => ({
      id,
      ...data,
    }));
  };
  const find_latest = async (query = {}) => {
    const db = await DB();
    const result = await db
      .collection(collection)
      .find(query)
      .sort({ createdAt: -1 })
      .limit(1);
    const found = await result.toArray();
    if (found.length === 0) return null;
    const { _id: id, ...data } = found[0];

    return { id, ...data };
  };
  const findAll = async (query = {}) => {
    const db = await DB();
    const result = await db.collection(collection).find(query);
    const found = await result.toArray();
    return found.map(({ _id: id, ...data }) => ({
      id,
      ...data,
    }));
  };
  const find = async (query = {}) => {
    const db = await DB();
    const result = await db.collection(collection).find(query);
    const found = await result.toArray();
    if (found.length === 0) return null;
    const { _id: id, ...data } = found[0];

    return { id, ...data };
  };
  const update = async (query = {}, update = {}, unset = false) => {
    const db = await DB();
    const result = await db.collection(collection).updateOne(query, {
      [unset ? "$unset" : "$set"]: { updatedAt: Date.now(), ...update },
    });
    return result.modifiedCount > 0 ? update : null;
  };

  const remove = async (query = {}) => {
    const db = await DB();
    const result = await db.collection(collection).deleteMany(query);

    return result.deletedCount;
  };
  const aggregate = async (query) => {
    const db = await DB();
    const result = await db.collection(collection).aggregate(query).toArray();
    return result.map(({ _id: id, ...data }) => ({ id, ...data }));
  };
  return Object.freeze({
    insert,
    find,
    findAll,
    remove,
    update,
    aggregate,
    find_latest,
    findFactory,
  });
};
