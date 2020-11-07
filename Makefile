#!make

REPO=radyak
IMAGE=radshift-core

BASE_IMAGE_ARM32=arm32v7/node:lts-alpine
BASE_IMAGE=node:lts-alpine

TAG_ARM=arm_latest
TAG=latest

default: deploy


## arm32

build.arm32: prepare
	docker build -t $(REPO)/$(IMAGE):$(TAG_ARM) --build-arg BASE_IMAGE=$(BASE_IMAGE_ARM32) .

deploy.arm32: build.arm32
	docker tag  $(REPO)/$(IMAGE):$(TAG_ARM) $(REPO)/$(IMAGE):$(TAG_ARM)
	docker push $(REPO)/$(IMAGE):$(TAG_ARM)


## x86

build: prepare
	docker build -t $(REPO)/$(IMAGE):$(TAG) --build-arg BASE_IMAGE=$(BASE_IMAGE) .

deploy: build
	docker tag  $(REPO)/$(IMAGE):$(TAG) $(REPO)/$(IMAGE):$(TAG)
	docker push $(REPO)/$(IMAGE):$(TAG)


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

run: build
	docker run -p 80:80 -p 443:443 --privileged -e CONF_DIR=/usr/src/conf -e ENV=dev $(REPO)/$(IMAGE):$(TAG)


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

deploy.all: deploy.arm32 deploy
