
FROM node:boron

RUN npm install -g firebase-tools

ENTRYPOINT ["/usr/local/bin/firebase"]