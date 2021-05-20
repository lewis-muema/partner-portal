FROM sendy-docker-local.jfrog.io/node:10.24.0-alpine AS build-stage

WORKDIR /build

ARG DOCKER_ENV

ENV DOCKER_ENV=$DOCKER_ENV
RUN echo ${DOCKER_ENV}

RUN npm config set registry https://registry.npmjs.org/

COPY package*.json ./ 
RUN npm install 

COPY . .

RUN if [ "$DOCKER_ENV" = "testing" ]; \
        then npm run staging; \
        elif [ "$DOCKER_ENV" = "beta" ]; \
        then npm run beta; \
        else npm run build; \
        fi

#############################
FROM sendy-docker-local.jfrog.io/nginx:stable-alpine  

RUN adduser -D sendy

WORKDIR /app

RUN mkdir -p mkdir -p /var/run/nginx /var/tmp/nginx \
    && chown -R sendy:sendy /usr/share/nginx/ /var/run/ /var/tmp/nginx /etc/nginx 

COPY ./nginx/default.conf  /etc/nginx/conf.d/
COPY  nginx/nginx.conf /etc/nginx/nginx.conf

# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log && \
        ln -sf /dev/stderr /var/log/nginx/error.log

COPY --from=build-stage --chown=sendy:sendy /build/dist ./


#Install dumb-init (init system for docker containers)
RUN wget -O /usr/local/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.5/dumb-init_1.2.5_x86_64
RUN chmod +x /usr/local/bin/dumb-init

USER sendy:sendy

EXPOSE 8080

CMD ["dumb-init", "nginx", "-g", "daemon off;"]








