FROM node:20-alpine3.20

ENV SERVER_SECRET_JWT=6a564b824d20014131b64c5aff752c921d43ac178a98f1e6062c19efb2bdee1c
ENV MONGODB_URL=mongodb+srv://doadmin:jR7vs06mKr84153y@db-mongodb-nyc3-81548-5e128ba5.mongo.ondigitalocean.com/warehouse-app?tls=true&authSource=admin&replicaSet=db-mongodb-nyc3-81548
ENV CORS_ORIGIN=http://arcawarehousing.com
ENV SENDING_EMAIL=Arcawarehousing@gmail.com
ENV SENDING_EMAIL_PASSWORD="lbcq wplr tdtd viz"
ENV BACKEND_NOTIFY_EMAIL="austin4705@gmail.com djl362@cornell.edu"
ENV API_ROUTE=http://arcawarehousing.com:9000/

# RUN echo ${MONGODB_URL_BASE}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install


COPY . .

EXPOSE 9000
EXPOSE 27017

CMD ["node", "index.js"]