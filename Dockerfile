FROM node:20

WORKDIR /app

COPY . .

RUN npm install
RUN cd backend && npm install

EXPOSE 3000

CMD ["node", "backend/server.js"]