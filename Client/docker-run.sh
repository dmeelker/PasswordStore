#!/bin/sh
docker run \
    --rm \
    --detach \
    --publish 8080:80 \
    --name client \
    passwordstoreclient:latest
