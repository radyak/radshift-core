#!make
include .env
export

IMAGE=radshift-core
REPO=radyak

BASE_IMAGE_ARM32=arm32v7/node:lts-slim
BASE_IMAGE_X86=node:lts-alpine

TAG=latest
TAG_X86=x86-latest

default:
	echo "No default goal defined"


## arm32

build.arm32:
	docker build -t $(REPO)/$(IMAGE):$(TAG) --build-arg BASE_IMAGE=$(BASE_IMAGE_ARM32) .

deploy.arm32: build.arm32
	docker tag  $(REPO)/$(IMAGE):$(TAG) $(REPO)/$(IMAGE):$(TAG)
	docker push $(REPO)/$(IMAGE):$(TAG)


## x86

build.x86:
	docker build -t $(REPO)/$(IMAGE):$(TAG_X86) --build-arg BASE_IMAGE=$(BASE_IMAGE_X86) .

deploy.x86: build.x86
	docker tag  $(REPO)/$(IMAGE):$(TAG_X86) $(REPO)/$(IMAGE):$(TAG_X86)
	docker push $(REPO)/$(IMAGE):$(TAG_X86)

run.x86: build.x86
	docker run -p 80:80 -p 443:443 -v /home/fvo/tmp/test-mounts:/usr/src/conf -e CONF_DIR=/usr/src/conf -e ENV=dev $(REPO)/$(IMAGE):$(TAG_X86)


## RPI

deploy.rpi.config:
	scp -P $(PORT) rpi.config/.env.conf $(SSH_USER)@$(DOMAIN):/home/pirate/conf/.env.conf
	scp -P $(PORT) rpi.config/.env.key $(SSH_USER)@$(DOMAIN):/home/pirate/conf/.env.key

deploy.rpi.cluster-config:
	scp -P $(PORT) docker-compose.RPI.yml $(SSH_USER)@$(DOMAIN):docker-compose.yml

deploy.rpi.radhub-config:
	scp -P $(PORT) ../radhub/radhub-backends.json $(SSH_USER)@$(DOMAIN):radhub-backends.json

deploy.rpi: deploy.rpi.config deploy.rpi.cluster-config deploy.rpi.radhub-config


## dev

tests:
	cd backend; npm test

tests.continuous:
	cd backend; npm test -- -w
	# npm test -- -w --grep 'lists files recursively'

run.dev.dependencies:
	docker-compose stop mongodb radhub testapp radshift-stream-downloader
	docker-compose up -d mongodb radhub testapp radshift-stream-downloader

run.dev.core:
	docker-compose stop core
	docker-compose up -d core

run.dev.backend: run.dev.dependencies
	cd backend; npm run watch

run.dev.frontend:
	cd frontend; npm start

run.cluster:
	docker-compose up --build

clean.cluster:
	docker-compose down

lint:
	npm run lint

# experimental
loop:
	#find - -type f -name Makefile -execdir make dev \; 
	find - -type f -name Makefile -execdir make dev \;



## common

deploy.all: deploy.arm32 deploy.x86