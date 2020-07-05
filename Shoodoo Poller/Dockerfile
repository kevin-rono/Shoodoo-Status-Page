FROM node:latest
WORKDIR /backend/shoodoo-server
COPY . /backend/
RUN cd shoodoo-server && \ 
npm install
RUN cd shared-util && \
npm install
CMD node ./shoodoo-server/index.js


