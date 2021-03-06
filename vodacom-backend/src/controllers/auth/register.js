const c = require("../../data/collections");
const bcrypt = require("bcryptjs");
const { ResponseError, Response } = require("../../utils");
const V = require("../../services/validator");
const SendMail = require("../../services/mailer");
const hash = require("../../services/hash-injector");
const express = require("express");
require("dotenv").config();

const gen_vendor_id = () =>
  `VEN${require("crypto").randomBytes(3).toString("hex").toUpperCase()}`;

/**
 * @param {express.response} request
 */
module.exports = async (request) => {
  const { name, email, userType, password, phone } = request.body;

  V.allExist(
    "You need to provide name, email, userType, password, phone",
    email,
    name,
    userType,
    password,
    phone
  )
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
    .isEmail("email is not valid", email);
  const hashedPassword = bcrypt.hashSync(password);

  const nameExists = await c.accounts.find({ name });
  if (nameExists) throw new ResponseError(400, "name is already in use");
  const emailExists = await c.accounts.find({ email });
  if (emailExists && emailExists.registration_completed)
    throw new ResponseError(400, "email is already in use");
  const phoneExists = await c.accounts.find({ phone }).then((user) => !!user);
  if (phoneExists) throw new ResponseError(400, "phone is already in use");
  if (
    emailExists &&
    !emailExists.registration_completed &&
    emailExists.userType !== userType
  )
    throw new ResponseError(
      400,
      `You were not invited as a ${userType}. Register as a ${emailExists.userType} instead`
    );
  let data = {};
  await c.accounts.remove({ email });
  const userData = {
    email,
    name,
    userType,
    password: hashedPassword,
    phone,
    isVerified: false,
    registration_completed: true,
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
  if (emailExists && !emailExists.registration_completed)
    userData._id = emailExists.id;
  data = await c.accounts.insert(userData);

  const host = request.get("host");
  const { protocol: scheme } = request;
  const email_ver_link = `${scheme}://${host}/verify?token=${hash(
    email
  )}&email=${email}`;
  if (process.env.STATE === "development") console.log(email_ver_link);
  delete data.password;
  SendMail(
    [email],
    "Verify your email address!",
    `Your account was created successfully. Click this link to verify your account: ${email_ver_link}`,
    `<b>Your Account was created successfully. Click this link to verify your account: <a href="${email_ver_link}">${email_ver_link}</a></b>`
  );
  return new Response(201, {
    error: false,
    ...data,
  });
};
