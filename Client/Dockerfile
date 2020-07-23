FROM node:current-alpine as builder
WORKDIR /webapp
COPY . .
RUN npm install
RUN npm run build

FROM httpd:alpine
COPY --from=builder /webapp/dist /usr/local/apache2/htdocs/
#FROM node
#RUN npm install -g http-server
# WORKDIR /webapp
# COPY --from=builder /webapp/dist .
# CMD http-server -p 8080 .