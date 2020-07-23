FROM node

RUN npm install -g http-server

WORKDIR /webapp
COPY dist /webapp/

CMD http-server -p 8080 .