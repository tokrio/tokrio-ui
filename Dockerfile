FROM node:18-alpine as builder

WORKDIR /tokrio

COPY . .

RUN yarn config set ignore-engines true && \
    yarn install && \
    yarn build

# Execution mirror 
FROM nginx:alpine

COPY --from=builder  /tokrio/build /www/wwwroot/web

EXPOSE 3000/tcp

CMD ["nginx", "-g", "daemon off;"]

