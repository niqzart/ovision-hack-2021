FROM python:3.9-slim

# RUN apk update && apk upgrade  # or apt
# RUN apk add --no-cache git gcc musl-dev libffi-dev openssl-dev

RUN pip3 install --upgrade pip

COPY requirements.txt .

RUN pip3 install -r requirements.txt

COPY . .

EXPOSE 5000

ENTRYPOINT ["./start.sh"]
