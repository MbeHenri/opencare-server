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

* `O3_URL` - o3 url 📌
* `O3_USER` - o3 user 📌
* `O3_PASSWORD` - o3 password 📌
* `MONGO_HOST` - mongo url for connection 📌
* `BASE_PASSWORD_PATIENT` - base password of a patient (123456)
* `ODOO_HOST` - odoo url 📌
* `ODOO_PORT` - odoo url 📌
* `ODOO_DB` - odoo db 📌
* `ODOO_USER` - odoo user 📌
* `ODOO_PASSWORD` - odoo password 📌
* `ODOO_CODE_SERVICE` - base de code du service (OPENCARES)
* `ODOO_PRICE_SERVICE` - prix de base d'un service (1500)
* `TALK_URL` - talk url 📌
* `TALK_USER` - talk user 📌
* `TALK_PASSWORD` - talk password 📌
* `TALK_INIT_PASSWORD` - base password of patient and doctor on talk (TALK_PASSWORD)
* `SERVER_PORT` - port of this backend (3001)
* `KEY_TOKEN` - key token 📌
* `ODOO_BANK_ID` - bank id for odoo (6)
* `ODOO_CASH_ID` - cash id for odoo (7)
