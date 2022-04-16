# "Faceprints"

<!-- project info or something here idk --->

## Running & Deploying
### Local (backend standalone, debug mode)
- start the server with (from the `backend` folder)
```sh
python main.py
```
- or create a run configuration in PyCharm

### Local (frontend standalone)
- start the server with (from the `frontend` folder)
```sh
npm run start
```

### Local (with docker)
- to build & start the project (from the project root folder)
```sh
docker-compose build
docker-compose up
```
- visit http://localhost/ for frontend or http://localhost:5000/ for backend

### Server
- pull & start the server, using latest images (aka images from master):
```sh
sh ~/faceprints/deployer.sh
```
- pull & start the server, using `brach-name` images:
```sh
env TAG="brach-name" sh ec ~/faceprints/deployer.sh
```
- manual pull & start (can be modified)
```sh
docker-compose pull
docker-compose up --no-build -d
```
- to see the starting logs, skip the `-d` option
