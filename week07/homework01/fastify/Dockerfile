FROM node:alpine3.14


RUN mkdir -p /data

COPY node_modules /data/node_modules
COPY logs /data/logs
COPY public /data/public
COPY plugin /data/plugin
COPY routers /data/routers
COPY app.js /data/
COPY package.json /data/

WORKDIR /data

EXPOSE 8100

CMD [ "node",  "app.js" ]