FROM node:12

WORKDIR /src/app
COPY package.json ./package.json
COPY migrations/ ./migrations
COPY knexfile.js ./knexfile.js
COPY src/ ./src/
COPY server.js ./server.js
RUN npm install
EXPOSE 3000

CMD ["npm", "run", "dev"]