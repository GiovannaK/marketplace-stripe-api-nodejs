FROM node:14

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

RUN npm run build

CMD [ "node", "dist/main" ]