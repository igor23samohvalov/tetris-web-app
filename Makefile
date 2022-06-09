install:
	npm ci
start:
	heroku local -f Procfile.dev
start dev:
	npm run start:dev
build:
	npm run build