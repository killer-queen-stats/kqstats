FROM node:10

# Install package dependencies
RUN DEBIAN_FRONTEND='noninteractive' apt-get -y update && \
    DEBIAN_FRONTEND='noninteractive' apt-get -y upgrade
RUN DEBIAN_FRONTEND='noninteractive' apt-get install -y --no-install-recommends netcat arp-scan

RUN mkdir -p /app && \
    mkdir -p /tmp

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN cp -a /tmp/node_modules /app

WORKDIR /app
ADD . /app

EXPOSE 3000
EXPOSE 8000