const c = require("../../data/collections");
const { Response, ResponseError } = require("../../utils");
const store = require("../../services/upload-provider");
const { Id } = require("../../services/provider");
module.exports.remove = async (request) => {
  const { id } = request.payload;
  const { id: arch_id } = request.body;
  request.V.allExist("You must provide id", arch_id);
  const arch_item = await c.archives.remove({ _id: arch_id, owner: id });
  if (!arch_item)
    throw new ResponseError(404, "The archive item was not found");
  try {
    await store.remove(`archives/${arch_id}`);
  } catch (error) {
    throw new ResponseError(400, error.message);
  }
  return new Response(200, {
    error: false,
    message: "Document has been deleted",
  });
};

module.exports.fetch = async (request) => {
  const { id } = request.payload;
  const { arch_id } = request.params;
  request.V.allExist("You must provide id", arch_id);
  const arch_item = await c.archives.find({ _id: arch_id, owner: id });
  if (!arch_item)
    throw new ResponseError(404, "The archive item was not found");
  return new Response(200, {
    error: false,
    data: arch_item,
  });
};

module.exports.fetchAll = async (request) => {
  const { id } = request.payload;
  const arch_items = await c.archives.findAll({ owner: id });
  return new Response(200, {
    error: false,
    data: arch_items,
  });
};

module.exports.add = async (request) => {
  const { id } = request.payload;
  const { name } = request.body;
  const { file: doc } = request;
  if (!name || !doc)
    throw new ResponseError(400, "You must provide name and document");
  const doc_id = Id();
  if (doc.mimetype != "application/pdf")
    throw new ResponseError(400, "You must provide only pdf files");
  let result;
  try {
    result = await store
      .upload(doc, "archives/" + doc_id)
      .then((result) => result.secure_url);
  } catch (error) {
    throw new ResponseError(400, error.message);
  }
  await c.archives.insert({ _id: doc_id, owner: id, name, link: result });

  return new Response(201, {
    error: false,
    message: "Document has been added to archive",
  });
};
