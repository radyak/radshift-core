ARG BASE_IMAGE=arm32v7/node:lts-slim


## Frontend
FROM ${BASE_IMAGE} AS frontend-build

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
COPY --from=frontend-build /usr/src/frontend/dist/frontend /usr/src/frontend

EXPOSE 3000:3000

CMD [ "npm", "start" ]
