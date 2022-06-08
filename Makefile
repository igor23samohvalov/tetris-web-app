install:
	npm ci
start:
	heroku local -f Procfile.dev
start-backend:
	npm run backend
start-frontend:
	npx webpack serve
build:
	npm run build