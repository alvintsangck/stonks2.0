FROM node:lts
WORKDIR /usr/src/app
COPY . .
EXPOSE 8080
CMD pnpm install && \ 
    pnpm knex migrate:latest &&\
    # yarn knex seed:run &&\
    node index.js 