# syntax=docker/dockerfile:1
   
FROM node:18-alpine
WORKDIR /
COPY . .
RUN npm install
CMD ["node", "www/bin"]
EXPOSE 3000
