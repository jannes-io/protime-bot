FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
RUN npx playwright install
RUN npx playwright install-deps

COPY . .
RUN npm run build

CMD ["node", "dist/protime.cjs"]

