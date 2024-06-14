FROM node:18 

COPY . /app 

WORKDIR /app 

RUN npm install

RUN npm run seed 

CMD ["npm", "run", "server"]

EXPOSE 8001