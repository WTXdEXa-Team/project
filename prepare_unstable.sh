#!/usr/bin/env bash
set -e

version="$(git rev-parse --short HEAD)"
scratch="$(mktemp -d)"
image="registry.gitlab.com/oax/dex-poc"

function finish {
    rm -rf "$scratch"
}
trap finish EXIT

git clone . "$scratch"

cd "$scratch"

# The source code ends up at /opt/ in the container.
docker build -f ci/Dockerfile -t "$image":"$version" .
docker tag "$image":"$version" "$image":latest
