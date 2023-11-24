FROM node:20-alpine

WORKDIR src

COPY package*.json ./

RUN npm install -g npm && npm install -g typescript && npm install

COPY . .

RUN npm run build

EXPOSE 3000

ARG HOST
ARG PORT
ARG USERNM
ARG PASSWORD
ARG SUPERJOB
ARG MONGOURI

ENV HOST=$HOST
ENV PORT=$PORT
ENV USERNM=$USERNM
ENV PASSWORD=$PASSWORD
ENV SUPERJOB=$SUPERJOB
ENV MONGOURI=$MONGOURI

CMD ["node", "build/main.js"]
