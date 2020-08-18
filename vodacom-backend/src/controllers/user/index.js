const c = require("../../data/collections");
const bcrypt = require("bcryptjs");
const { ResponseError, Response } = require("../../utils");
const V = require("../../services/validator");
const SendMail = require("../../services/mailer");
const store = require("../../services/upload-provider");
const hash = require("../../services/hash-injector");
const express = require("express");
require("dotenv").config();

const gen_vendor_id = () =>
  `VEN${require("crypto").randomBytes(3).toString("hex").toUpperCase()}`;

module.exports.uploadImage = async (request) => {
  const { id } = request.payload;
  const { file: image } = request;
  if (!["image/jpeg", "image/png"].includes(image.mimetype))
    throw new ResponseError(400, "You must provide only jpeg or png images");

  let result;
  try {
    result = await store.upload(image, `${id}/` + id);
  } catch (error) {
    throw new ResponseError(400, error.message);
  }
  await c.accounts.update({ _id: id }, { avatar: result.secure_url });

  return new Response(200, {
    error: false,
    message: "Image has been uploaded",
    result: result.public_url,
  });
};

/**
 * @param {express.response} request
 */
module.exports.update = async (request) => {
  const { id } = request.payload;
  const { name, email, userType, phone } = request.body;

  V.allExist("You need to provide name, email, userType, phone", email, phone)
    .matchesRegex(
      "userType must be one of business, regular, vendor",
      userType,
      /^(business|regular|vendor)$/
    )
    .matchesRegex(
      "phone must be of the form +234 --- --- ----",
      phone,
      /^\+234\ ?\d{3}\ ?\d{3}\ ?\d{4}$/
    )
    .isEmail("email is not valid", email)
    .expr("The passwords do not match", opassword === npassword);
  const hashedPassword = bcrypt.hashSync(password);

  const emailExists = await c.accounts.find({ email });
  if (emailExists.password !== opassword)
    throw new ResponseError(
      400,
      "Password provided does not match existing password"
    );

  let data = {};
  await c.accounts.remove({ email });
  const userData = {
    email,
    name,
    userType,
    password: hashedPassword,
    phone,
  };
  if (userType === "vendor") {
    const { service_category, service_location } = request.body;
    V.allExist(
      "You must provide service_category and service_location for a vendor account before registering",
      service_category,
      service_location
    );
    userData.service_category = service_category;
    userData.service_location = service_location;
    let vendor_id, v;
    do {
      vendor_id = gen_vendor_id();
      v = await c.rfq.find({ vendor_id });
    } while (v);
    userData.vendor_id = vendor_id;
  }
  if (userType === "business") {
    const { location } = request.body;
    V.allExist("You must provide location", location);
    userData.location = location;
  }
  await c.accounts.update({ _id: id }, { userData });

  return new Response(201, {
    error: false,
    ...userData,
  });
};
