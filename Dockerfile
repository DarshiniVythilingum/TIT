#Part 2
FROM node:latest AS builder
WORKDIR /app
COPY ./app/package*.json ./
RUN npm install
COPY ./app/ ./
RUN npm run build

# FROM nginx
#Part 1
FROM debian:latest

RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y \
    mariadb-server \
    nginx \
    nodejs \  
    npm \
    python3 \
    python3-pip \
    python3-venv && \
    apt-get clean


RUN npm install -g pm2

RUN python3 -m venv /app/venv

RUN /app/venv/bin/pip install --upgrade pip && \
    /app/venv/bin/pip install python-dotenv mysql-connector-python

WORKDIR /app

#For API
COPY ./api/index.js /app/
COPY ./api/package*.json /app
RUN npm install

COPY ./app/dist /var/www/html
COPY ./database.sql /app/
COPY ./create_tables_db.py /app/
COPY ./default.conf /etc/nginx/sites-available/default

RUN echo "API_PORT=3000" >> /app/.env &&\
    echo "MARIADB_ROOT_PASSWORD=123456" >> /app/.env &&\
    echo "MARIADB_DATABASE-in-class-db" >> /app/.env &&\
    echo "MARIADB_USER-in-class-user" >> /app/.env &&\
    echo "MARIADB_PASSWORD=654321" >> /app/.env
    
EXPOSE 80

COPY entrypoint.sh /entrypoint.sh
#this will be our entrypoint script executable
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
