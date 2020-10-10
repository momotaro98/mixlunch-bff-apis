FROM node:10.14.2-slim

# Create app directory
WORKDIR /src

# Docker's image layer caching
COPY package.json yarn.lock ./
RUN yarn --pure-lockfile

# Bundle app source
COPY . .

# Install app dependencies
RUN cd /src; yarn

CMD ["yarn", "start"]
