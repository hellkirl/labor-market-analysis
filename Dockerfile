FROM node:20-alpine

WORKDIR /src

COPY package*.json ./

RUN npm config get proxy && \
    npm config rm proxy && \
    npm config rm https-proxy && \
    npm install

RUN apk add --no-cache \
    udev \
    ttf-freefont \
    chromium

ARG CHROMEDRIVER_VERSION=114.0.5735.90

RUN wget -O /tmp/chromedriver.zip https://chromedriver.storage.googleapis.com/$CHROMEDRIVER_VERSION/chromedriver_linux64.zip && \
    unzip /tmp/chromedriver.zip -d /usr/local/bin/ && \
    rm /tmp/chromedriver.zip && \
    chmod +x /usr/local/bin/chromedriver

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

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "build/main.js"]