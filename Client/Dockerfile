FROM node:current-alpine as builder
WORKDIR /webapp

RUN apk add --no-cache --virtual .build-deps make gcc g++ python

ENV REACT_APP_ENVIRONMENT production

COPY package.json ./

#RUN npm ci
RUN npm install react-scripts@3.4.1 -g --silent
RUN npm install
COPY . .

RUN npm run build


FROM httpd:alpine
COPY --from=builder /webapp/build /usr/local/apache2/htdocs/