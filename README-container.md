# Docker Container

## build

```sh
docker build -t opencare-patient-backend .
```

## run

```sh
docker run --env-file ./example.env opencare-patient-backend [--network <network_name>]
```

## Environment Variables

- `MONGO_HOST` - mongo host 📌
- `MONGO_PORT` - mongo port (27017)
- `MONGO_USER` - mongo user used (define for authentification)
- `MONGO_PASSWORD` - password of mongo user (define for authentification)
- `FRONTEND_HOST` - host of the frontend 📌
- `FRONTEND_PORT` - port of the frontend (80)
- `SERVER_PORT` - port of this backend (3001)
- `KEY_TOKEN` - key token 📌
