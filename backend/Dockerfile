FROM python:3.9-slim

# RUN apk update && apk upgrade  # or apt
# RUN apk add --no-cache git gcc musl-dev libffi-dev openssl-dev
RUN apt update && apt install -y gcc clang clang-tools cmake python3 ffmpeg libsm6 libxext6  -y

RUN pip3 install --upgrade pip

COPY requirements.txt .

RUN pip3 install -r requirements.txt

COPY . .

EXPOSE 5000

ENTRYPOINT ["./start.sh"]
