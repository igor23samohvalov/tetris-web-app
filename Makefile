install:
	npm ci
start:
	npm run start
start-backend:
	npm start --watch --verbose-watch
start-frontend:
	npx webpack serve
build:
	npm run build