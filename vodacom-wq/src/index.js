require("dotenv").config();
const { VODACOM_WORKER } = process.env;
const grpc = require("grpc");
const MailService = require("./rpcs/mailer");

const server = new grpc.Server();

server.addService(MailService.package.service, MailService.impl);

server.bind(VODACOM_WORKER, grpc.ServerCredentials.createInsecure());
console.log(`gRPC Server running at ${VODACOM_WORKER}`);
server.start();
