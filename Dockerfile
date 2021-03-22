FROM sendy-docker-local.jfrog.io/node:10.24.0-alpine AS build-stage

RUN mkdir /build 

WORKDIR /build

COPY . /build/

ARG DOCKER_ENV

ENV DOCKER_ENV=$DOCKER_ENV
RUN echo ${DOCKER_ENV}
RUN if [ "$DOCKER_ENV" = "testing" ]; \
        then npm install && npm run staging; \
        elif [ "$DOCKER_ENV" = "beta" ]; \
        then npm install && npm run beta; \
        else npm install && npm run build; \
        fi


#############################
FROM sendy-docker-local.jfrog.io/nginx:stable-alpine  

WORKDIR /app 

# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log && \
        ln -sf /dev/stderr /var/log/nginx/error.log


COPY --from=build-stage /build/dist ./

COPY ./nginx/default.conf  /etc/nginx/conf.d/


CMD ["nginx", "-g", "daemon off;"]









# RUN apt-get update && \
#         apt-get install -y sudo curl bzip2 wget git vim gnupg

# RUN curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -

# RUN sudo apt-get -y install build-essential

# RUN sudo apt-get -y install nodejs

# RUN sudo apt-get clean

