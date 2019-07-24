FROM nginx:latest

RUN apt-get update && \
        apt-get install -y sudo curl bzip2 wget git vim gnupg

RUN curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -

RUN sudo apt-get -y install build-essential

RUN sudo apt-get -y install nodejs

RUN sudo apt-get clean
# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log && \
        ln -sf /dev/stderr /var/log/nginx/error.log

COPY ./nginx/default.conf  /etc/nginx/conf.d/

RUN mkdir /build && mkdir /app

WORKDIR /build

COPY . /build/

ARG DOCKER_ENV

ENV DOCKER_ENV=$DOCKER_ENV
RUN echo ${DOCKER_ENV}
RUN if [ "$DOCKER_ENV" = "testing" ]; \
        then npm install && npm run staging; \
        else npm install && npm run build; \
        fi

RUN cp nginx/default.conf /etc/nginx/conf.d/default.conf && \
        cp -R /build/dist/*  /app/ && \
        rm -fr /build

WORKDIR /app

CMD ["nginx", "-g", "daemon off;"]