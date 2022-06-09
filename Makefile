install:
	npm ci
build:
	npm run build
start:
	heroku local -f Procfile.dev
start dev:
	npm run start:dev
