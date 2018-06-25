FROM node:10

# Install package dependencies
RUN DEBIAN_FRONTEND='noninteractive' apt-get -y update && \
    DEBIAN_FRONTEND='noninteractive' apt-get -y upgrade
RUN DEBIAN_FRONTEND='noninteractive' apt-get install -y --no-install-recommends netcat arp-scan

RUN mkdir -p /app && \
    mkdir -p /tmp

WORKDIR /app

COPY package.json ./

RUN npm install
COPY . .
RUN npm run-script build

EXPOSE 3000
