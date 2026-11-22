# Croqueton 2026

This is a [Next.js](https://nextjs.org) project bootstrapped with
[`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Base de datos

El proyecto usa PostgreSQL con el driver `pg` directamente (sin ORM). El esquema
vive en `db/migrations/*.sql` y se aplica en orden con `scripts/migrate.mjs`,
que registra lo aplicado en la tabla `schema_migrations`.

1. Instala PostgreSQL (14 o superior) y asegúrate de que el servicio esté corriendo.
2. Copia `.env.example` a `.env.local` y ajusta `DATABASE_URL` con tu usuario y
   contraseña.
3. Ejecuta:

   ```bash
   pnpm db:migrate
   ```

   El script crea la base si no existe, aplica las migraciones pendientes y crea
   el superadmin definido en `SUPERADMIN_EMAIL` / `SUPERADMIN_PASSWORD`.

Para cambiar el esquema, agrega un archivo nuevo (`003_algo.sql`, …) en lugar de
editar uno ya aplicado.

## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page
auto-updates as you edit the file.

This project uses
[`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
to automatically optimize and load [Geist](https://vercel.com/font), a new font
family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out
[the Next.js GitHub repository](https://github.com/vercel/next.js) - your
feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the
[Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
