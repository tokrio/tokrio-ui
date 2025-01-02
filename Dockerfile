FROM node:21-alpine as builder

WORKDIR /tokrio

COPY . .

RUN yarn cache clean

RUN npm config set registry https://registry.npmmirror.com

RUN yarn config set registry https://registry.npmmirror.com

RUN yarn install && \
    yarn build

# Execution mirror 
# FROM nginx:alpine

COPY --from=builder  /tokrio/build /www/wwwroot/web

# EXPOSE 3000/tcp

# CMD ["nginx", "-g", "daemon off;"]