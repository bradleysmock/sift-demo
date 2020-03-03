FROM node

COPY package.json .

RUN npm install && npm install tsc -g

RUN tsc

COPY dist dist

CMD [ "npm", "start" ]