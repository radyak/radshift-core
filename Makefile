#!make
include .env
export

IMAGE=radshift-core

BASE_IMAGE_ARM32=arm32v7/node:lts-slim
BASE_IMAGE_X86=node:lts-alpine

TAG=latest
TAG_X86=x86-latest

default:
	echo "No default goal defined"


## arm32

build.arm32: prepare
	docker build -t $(REPO)/$(IMAGE):$(TAG) --build-arg BASE_IMAGE=$(BASE_IMAGE_ARM32) .

deploy.arm32: build.arm32
	docker tag  $(REPO)/$(IMAGE):$(TAG) $(REPO)/$(IMAGE):$(TAG)
	docker push $(REPO)/$(IMAGE):$(TAG)


## x86

build.x86: prepare
	docker build -t $(REPO)/$(IMAGE):$(TAG_X86) --build-arg BASE_IMAGE=$(BASE_IMAGE_X86) .

deploy.x86: build.x86
	docker tag  $(REPO)/$(IMAGE):$(TAG_X86) $(REPO)/$(IMAGE):$(TAG_X86)
	docker push $(REPO)/$(IMAGE):$(TAG_X86)


## tests

tests:
	cd backend; npm test

tests.continuous:
	cd backend; npm test -- -w


## run

run.dev.backend:
	cd backend; npm run watch

run.dev.frontend:
	cd frontend; npm start

run.x86: build.x86
	docker run -p 80:80 -p 443:443 -v /home/fvo/tmp/test-mounts:/usr/src/conf -e CONF_DIR=/usr/src/conf -e ENV=dev $(REPO)/$(IMAGE):$(TAG_X86)


## other

prepare:
	git pull

lint:
	npm run lint

# experimental
loop:
	#find - -type f -name Makefile -execdir make dev \; 
	find - -type f -name Makefile -execdir make dev \;



## common

deploy.all: deploy.arm32 deploy.x86