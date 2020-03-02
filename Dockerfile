FROM node:13.3.0 AS compile-image

RUN npm install -g yarn

WORKDIR /opt/ng
COPY package.json yarn.lock ./
RUN yarn install

ENV PATH="./node_modules/.bin:$PATH"

COPY . ./
RUN yarn build:prod

FROM nginx
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=compile-image /opt/ng/dist/satisfactory-planner /usr/share/nginx/html
