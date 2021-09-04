FROM node:14

WORKDIR /usr/app
COPY package.json ./
COPY yarn.lock ./
COPY templates templates
RUN yarn install --frozen-lockfile --production
COPY dist dist
CMD [ "npm", "start" ]
