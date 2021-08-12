FROM improwised/rce-base:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

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

CMD ["node", "server.js"]
