FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

# FIXME: Check if this is working properly, maybe put a string around the command start:prod and start:dev
CMD ["npm", "run", "$(if [ $NODE_ENV = 'production' ] ; then start:prod ; else start:dev; fi)"]
