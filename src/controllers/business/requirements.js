const c = require("../../data/collections");
const { Response, ResponseError } = require("../../utils");
const { Id } = require("../../services/provider");

module.exports.get = async request => {
  const { id } = request.payload;

  const business = await c.accounts.find({ _id: id });
  return new Response(200, {
    error: false,
    requirements: business.requirements || {}
  });
};

module.exports.set = async request => {
  const { id } = request.payload;
  const { requirement, type } = request.body;

  if (!requirement)
    throw new ResponseError(400, "You must provide requirement");
  if (!["statutory", "document"].includes(type))
    throw new ResponseError(
      400,
      "type must be one of 'statutory' or 'document'"
    );
  const { requirements } = await c.accounts.find({ _id: id });
  if (requirements) {
    if (requirements[type]) {
      if (Object.values(requirements[type]).includes(requirement))
        throw new ResponseError(400, "Requirement already exists");
    }
  }
  const req_id = Id();
  await c.accounts.update(
    { _id: id },
    { [`requirements.${type}.${req_id}`]: requirement }
  );

  return new Response(200, {
    error: false,
    message: "Requirement has been set"
  });
};

module.exports.remove = async request => {
  const { id } = request.payload;
  const { requirement_id, type } = request.body;
  if (!requirement_id)
    throw new ResponseError(400, "You must provide requirement_id");
  if (!["statutory", "document"].includes(type))
    throw new ResponseError(
      400,
      "type must be one of 'statutory' or 'document'"
    );
  const { requirements } = await c.accounts.find({ _id: id });
  if (!requirements || !requirements[type])
    throw new ResponseError(400, "There are no requirements to remove");
  if (!(requirement_id in requirements[type]))
    throw new ResponseError(400, "There are no requirements by that id");
  await c.accounts.update(
    { _id: id },
    { [`requirements.${type}.${requirement_id}`]: "" },
    true
  );

  return new Response(200, {
    error: false,
    message: "Requirement has been removed"
  });
};

module.exports.edit = async request => {
  const { id } = request.payload;
  const { requirement_id, new_requirement, type } = request.body;

  if (!requirement_id || !new_requirement)
    throw new ResponseError(
      400,
      "You must provide requirement_id and new_requirement"
    );
  if (!["statutory", "document"].includes(type))
    throw new ResponseError(
      400,
      "type must be one of 'statutory' or 'document'"
    );
  const { requirements } = await c.accounts.find({ _id: id });

  if (!requirements || !requirements[type])
    throw new ResponseError(400, "There are no requirements to edit");
  if (!(requirement_id in requirements[type]))
    throw new ResponseError(400, "There are no requirements by that id");
  await c.accounts.update(
    { _id: id },
    { [`requirements.${type}.${requirement_id}`]: new_requirement }
  );

  return new Response(200, {
    error: false,
    message: "Requirement has been updated"
  });
};
