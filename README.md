#

docker run -p 8081:80 -v C:\Projects\<YOUR PROJECT FOLDER>\dist:/usr/share/nginx/html -d nginx

#

docker build -t darsh/tit:v1 .

#

docker run -e MARIADB_ROOT_PASSWORD=123456 -e MARIADB_DATABASE-in-class-db -e MARIADBL_USER-in-class-user -e MARIADB_PASSWORD=123456 -p 3306:3306 -d mariadb
I
