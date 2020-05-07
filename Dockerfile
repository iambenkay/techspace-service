FROM node:12

WORKDIR /vodacom
COPY package.json .
COPY yarn.lock .
RUN npm i yarn
RUN yarn
COPY . .

ENV STATE development
ENV PORT 3000
ENV MONGODB_URI mongodb://heroku_0x3nzkpj:3stg1bqkh77hli0ad5t2l6ek38@ds213079.mlab.com:13079/heroku_0x3nzkpj
ENV DB_NAME heroku_0x3nzkpj
ENV CLIENT_APP https://vendor-alliance.web.app
ENV EMAIL_VER_SECRET 8d978f2759277f5e2d4309cb7ea02d83
ENV CLOUDINARY_URL cloudinary://231427812941689:oK-eqUKXxMsKCoI2Hf4Lx5GYea0@vendor-alliance
ENV EMAIL_PORT 2525
ENV EMAIL_HOST smtp.mailtrap.io
ENV EMAIL_PASSWORD 8b15995a767d78
ENV EMAIL_USER 25d6a7a6c2384a
ENV EMAIL_USE_TLS 0
ENV JWT_SECRET_KEY cfbaf57cda02354504f72e53fb840539
ENV PUBNUB_PUB_KEY pub-c-1c6fecc4-55b5-4384-a444-12fba15c8d36
ENV PUBNUB_SUB_KEY sub-c-8f5674e8-6f1b-11ea-bbe3-3ec3e5ef3302


EXPOSE 3000
CMD ["yarn", "start"]

