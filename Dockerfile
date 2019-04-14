ARG BASE_IMAGE=arm32v7/node


## Frontend
FROM node:10 AS frontend-build

WORKDIR /usr/src/frontend

COPY ./frontend/package*.json ./
RUN npm install
COPY ./frontend ./

RUN npm run build



## Backend
FROM ${BASE_IMAGE} AS runtime

COPY ./qemu-arm-static /usr/bin/qemu-arm-static

WORKDIR /usr/src/app
COPY ./backend/package*.json ./
RUN npm install
COPY ./backend .
COPY --from=frontend-build /usr/src/frontend /usr/src/frontend

EXPOSE 80:80
EXPOSE 443:443

CMD [ "npm", "start" ]
