FROM node:latest
WORKDIR /app
COPY ./package.json package.json
RUN npm install

COPY ./src src

EXPOSE 8080
CMD ["npm", "start"]