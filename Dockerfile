FROM node:20-alpine

WORKDIR /src

COPY package*.json ./

RUN npm config get proxy && \
    npm config rm proxy && \
    npm config rm https-proxy && \
    npm install && \
    # Install dependencies required for Chromium and Chromedriver
    apk add --no-cache \
        chromium \
        nss \
        freetype \
        freetype-dev \
        harfbuzz \
        ca-certificates \
        ttf-freefont \
        bash && \
    # Set up Chromedriver installation path
    export CHROME_BIN=/usr/bin/chromium-browser && \
    export CHROME_PATH=/usr/lib/chromium/ && \
    npm install chromedriver --chromedriver-force-download && \
    # Clean up unnecessary dependencies
    apk del --no-cache \
        chromium \
        nss \
        freetype-dev \
        harfbuzz && \
    rm -rf /var/cache/* /tmp/*

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
