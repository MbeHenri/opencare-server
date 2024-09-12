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

* `SERVER_PORT` - port of this backend (3001)
* `KEY_TOKEN` - key token 📌
* `CORS_ALLOW_HOSTS` - (*)
* `O3_URL` - o3 url 📌
* `O3_USER` - o3 user 📌
* `O3_PASSWORD` - o3 password 📌
* `MONGO_URL` - mongo url for connection 📌
* `ODOO_HOST` - odoo url 📌
* `ODOO_PORT` - odoo url 📌
* `ODOO_DB` - odoo db 📌
* `ODOO_USER` - odoo user 📌
* `ODOO_API_KEY` - odoo password 📌
* `ODOO_PRICE_SERVICE` - prix de base d'un service (1500)
* `ODOO_CODE_SERVICE` - base de code du service (OPENCARES)
* `ODOO_BANK_ID` - bank id for odoo (6)
* `ODOO_CASH_ID` - cash id for odoo (7)
* `SECURE` - boolean indicate that we use secure or not odoo connexion (true)
* `TALK_URL` - talk url 📌
* `TALK_USER` - talk user 📌
* `TALK_PASSWORD` - talk password 📌
* `TALK_INIT_PASSWORD` - base password of patient and doctor on talk (TALK_PASSWORD)
* `BASE_LINKROOM_TALK` - base link for the talk room (/talk)
* `SSL_KEY_PATH` - ssl key path ('')
* `SSL_CERT_PATH` - ssl cert path
