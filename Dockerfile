FROM node:18
ENV SECRET_WORD="MySecret"

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
CMD ["node", "src/000.js"]