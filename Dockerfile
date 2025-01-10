FROM node:lts-slim

WORKDIR /app

COPY . .

RUN apt-get update -y
RUN apt-get install -y openssl

RUN npm install

RUN npx prisma db push --accept-data-loss

RUN npx tsx prisma/seed.ts

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]