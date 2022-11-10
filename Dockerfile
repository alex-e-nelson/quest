FROM node:18
ARG PORT_ARG
ENV SECRET_WORD="MySecret"
ENV PORT=$PORT_ARG

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
CMD ["node", "src/000.js"]