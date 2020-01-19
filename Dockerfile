FROM node:12

WORKDIR /src/app
COPY package.json .
COPY . .
RUN npm install
EXPOSE 3000

CMD ["npm", "run", "dev"]