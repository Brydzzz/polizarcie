FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm run update

EXPOSE 3000

CMD ["npm", "start"]