# OpenTelemetry Tempo

## Technical Stack
- Grafana Cloud Tempo
- Express

## Setup environment

Rename `.env.example` and setup environment in `.env`
```sh
GRAFANA_CLOUD_TEMPO_USER=
GRAFANA_CLOUD_TEMPO_PASSWORD=
GRAFANA_CLOUD_TEMPO_URL=
GRAFANA_CLOUD_TEMPO_DIGEST=
```

Run the command to generate `otel-config.yaml`
```sh
npm run yaml
```

#### Grafana Cloud Authentication 

Run the `$DIGEST` using following command, `user` and `pass` can be found on Grafana Cloud Tempo
```sh
echo -n "user:pass" | base64
```

## Start Service

Start Docker 
```sh
docker-compose up
```

#### Send Request

Use `curl` to send request to nginx
```sh
curl localhost "localhost/api/v1/kennels?id=2"
```
