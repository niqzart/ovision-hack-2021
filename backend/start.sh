#!/bin/sh
gunicorn --certfile=/etc/nginx/ssl/live/faceprints.hopto.org/fullchain.pem --keyfile=/etc/nginx/ssl/live/faceprints.hopto.org/privkey.pem --bind 0.0.0.0:5000 --worker-class eventlet -w 1 main:app
