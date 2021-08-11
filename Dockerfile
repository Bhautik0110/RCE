FROM node:12-alpine

WORKDIR /app

#### PYTHON INSTALLATION
RUN \
    set -ex; \
    export PYTHONUNBUFFERED=1; \
    apk update; \
    apk add --no-cache python3 && ln -sf python3 /usr/bin/python; \
    python3 -m ensurepip; \
    pip3 install --no-cache-dir --upgrade pip setuptools

### GO INSTALLATION
COPY --from=golang:1.13-alpine "/usr/local/go/" "/usr/local/go/"
ENV PATH="/usr/local/go/bin:${PATH}" GO111MODULE=on CGO_ENABLED=0 GOOS="linux" GOARCH="amd64"

### JAVA INSTALLATION
RUN \
    set -ex; \
    apk fetch openjdk8; \
    apk add --no-cache openjdk8
ENV PATH="/usr/lib/jvm/java-1.8-openjdk/bin:${PATH}"

### PHP INSTALLATION
RUN apk add --no-cache php7

### GCC INSTALLATION
RUN apk add --no-cache g++; \
    apk add --no-cache alpine-sdk --virtual .gyp

COPY package*.json ./

RUN npm install && apk del .gyp && rm -rf /var/cache/apk/*

RUN npm install nodemon -g

COPY . .

RUN adduser RCE -D

USER RCE

RUN javac -version && \
    java -version && \
    node -v && \
    go version && \
    gcc -v && \
    php -v && \
    python -V

VOLUME [ "/app" ]

CMD ["nodemon", "index.js"]
