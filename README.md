# "Faceprints"

<!-- project info or something here idk --->

## Deploy

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
