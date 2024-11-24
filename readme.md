git checkout prod ; git reset --hard master ; git push -f origin prod ; git checkout master


git checkout prod ; git reset --hard master ;  git merge master -X theirs ; git add .; git commit -m "mergingMessage"; git push ; git checkout master

docker build -t arca-frontend-server .
docker build -t arca-backend-server .

docker run -p 27017:27017 -p 9000:9000 arca-backend-server 
docker run -p 27017:27017 -p 3000:3000 arca-frontend-server 



docker run -p 27017:27017 -p 9000:9000 arca-backend-server & docker run -p 27017:27017 -p 3000:3000 arca-frontend-server 


docker build -t arca-frontend-server . & docker build -t arca-backend-server .

docker build -t arca-frontend-server . & docker build -t arca-backend-server .


Devops:
Getting a server to work
set workflows app ip and secrets.GHACTIONSKEYPRIV properly
move ghActionsKey into ~/.ssh/ and rename file to id_rsa.github

Openssl:
stop web server

sudo apt install snapd
sudo snap install --classic certbot
sudo certbot certonly --standalone
arcawarehousing@gmail.com
arcawarehousing.com
