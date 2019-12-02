ARG BASE_IMAGE=arm32v7/node:lts-slim


## Frontend
FROM node:10 AS frontend-build

WORKDIR /usr/src/frontend

COPY ./frontend/package*.json ./
RUN npm install
COPY ./frontend ./

RUN npm run build-prod



## Backend
FROM ${BASE_IMAGE} AS runtime

WORKDIR /usr/src/app
COPY ./backend/package*.json ./
RUN npm install --only=production
COPY ./backend .
COPY --from=frontend-build /usr/src/frontend/dist/management /usr/src/frontend/dist/management

EXPOSE 3000:3000

CMD [ "npm", "start" ]
