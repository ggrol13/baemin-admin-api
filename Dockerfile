FROM node:16.17.0-alpine
#나머지 스크립트 완성 해보기
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4000
CMD [ "node", "src/app.js"]