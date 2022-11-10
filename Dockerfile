FROM node:18
ENV SECRET_WORD="MySecret"
ENV PORT=80

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
CMD ["node", "src/000.js"]