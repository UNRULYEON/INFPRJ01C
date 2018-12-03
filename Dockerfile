FROM node:10

WORKDIR /usr/src/app
COPY package.json /usr/src/app

ENV PATH=/usr/local/cargo/bin:$PATH

RUN npm -v
RUN npm install
RUN npm install bcrypt@latest --save


COPY . /usr/src/app

EXPOSE 3001
CMD [ "npm", "start" ]