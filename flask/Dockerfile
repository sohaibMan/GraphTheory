# syntax=docker/dockerfile:1.4
FROM --platform=$BUILDPLATFORM python:3.6-alpine AS builder


WORKDIR /src
COPY requirements.txt /src

# RUN --mount=type=cache,target=/root/.cache/pip && \ 
# RUN  apt-get update && apt-get install -y python3 python3-pip  python3-matplotlib && \
RUN apk add g++ jpeg-dev zlib-dev libjpeg make
RUN  pip3 install -r requirements.txt 


COPY . .

CMD ["python3", "server.py"]

FROM builder as dev-envs

RUN <<EOF
apk update
apk add git
EOF

RUN <<EOF
addgroup -S docker
adduser -S --shell /bin/bash --ingroup docker vscode
EOF

# install Docker tools (cli, buildx, compose)
COPY --from=gloursdocker/docker / /

CMD ["python3", "server.py"]
