FROM node:12

WORKDIR /vodacom
COPY package.json .
COPY yarn.lock .
RUN npm i yarn
RUN yarn
COPY . .

EXPOSE 3000
CMD ["yarn", "start"]

