require("dotenv").config();
const grpc = require("grpc");
const MailService = require("./rpcs/mailer");

const server = new grpc.Server();

server.addService(MailService.package.service, MailService.impl);

server.bind(process.env.HOST, grpc.ServerCredentials.createInsecure());
server.start();
