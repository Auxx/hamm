```shell
$ docker run --name homeassistant \
    -p 8123:8123 \
    -e 'TZ=Europe/London' \
    -v /path/to/project/build:/config \
    -v /etc/localtime:/etc/localtime:ro \
    ghcr.io/home-assistant/home-assistant:stable
```
