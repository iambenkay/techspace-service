FROM node:12

WORKDIR /vodacom
COPY package.json .
COPY yarn.lock .
RUN npm i yarn
RUN yarn
COPY . .

EXPOSE 3000
EXPOSE 3001
CMD ["yarn", "start"]
