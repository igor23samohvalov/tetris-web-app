install:
	npm ci
start heroku:
	herocu local -f Procfile.dev
start:
	npm run start
start-backend:
	npm start --watch --verbose-watch
start-frontend:
	npx webpack serve
build:
	npm run build