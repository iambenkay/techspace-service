const Notification = require("./notifier");
const { ResponseError } = require("../utils");
const { ModelError } = require("../models/model");

module.exports = (controller) => {
  return async (request, response) => {
    try {
      let x = await controller(request);
      await Notification.create(x.notifications);
      return response.status(x.status).send(x.data);
    } catch (error) {
      console.error(error.message, error.stack);
      if (error instanceof ResponseError)
        return response.status(error.status).send({
          error: true,
          message: error.message,
        });
      if (error instanceof ModelError)
        return response.status(400).send({
          error: true,
          message: error.message,
        });
      return response.status(500).send(`${error.message} - ${error.stack}`);
    }
  };
};
