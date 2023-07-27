FROM node:18.12.1-alpine

RUN mkdir -p /usr/app

WORKDIR /usr/app

COPY package.json .
COPY private_node_modules /usr/app/private_node_modules

RUN npm install

COPY ./ .

CMD ["npm", "run", "dev"]
