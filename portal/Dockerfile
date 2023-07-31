FROM node

RUN mkdir -p /usr/app

WORKDIR /usr/app

COPY package.json .

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
