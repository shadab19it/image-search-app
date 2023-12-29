# Melting Flower

## Setup virtual environment

```sh
python -m venv .venv
source .venv/bin/activate
```

## Install requirements

```sh
pip install -r requirements.txt
```

## Setup environment

1. cp `.env.sample` `.env`
2. Include `DATABASE_URL`
   ```
   DATABASE_URL="postgresql://<user>:<password>@<url>:5432/postgres?schema=<scheme>"
   ```
   > Note that you should change appropriate values in `user`, `password`, `url`, `scheme` fields. Or you can even use other database. More about [connection urls](https://www.prisma.io/docs/reference/database-connectors/connection-urls)

> After installing packages

```sh
pip freeze > requirements.txt
```

## Generate Prisma Client and table in db

```sh
prisma generate

primsa db push
```

## Notes

# In root dir there are db folder if not created then create the folder

1. imgDB/mandap
2. imgDB/master

## Start server

```sh
uvicorn main:app --reload
```

## After Server started need to run some apis from docs fastapi
