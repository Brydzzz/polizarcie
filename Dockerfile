FROM node:lts-slim

WORKDIR /app

COPY . .

RUN apt-get update -y
RUN apt-get install -y openssl

RUN npm run update

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]