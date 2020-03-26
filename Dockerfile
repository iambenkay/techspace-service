FROM node:12

WORKDIR /vodacom
COPY package.json .
COPY yarn.lock .
RUN npm i yarn
RUN yarn
COPY . .

FROM mongo

EXPOSE 3000
EXPOSE 27017
EXPOSE 60021
CMD ["yarn", "start"]

