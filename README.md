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

Para cambiar el esquema, agrega un archivo nuevo (`004_algo.sql`, …) en lugar de
editar uno ya aplicado.

## Correos (SMTP)

Los correos se envían con `nodemailer` usando las variables `SMTP_*` y
`MAIL_FROM` de `.env.local` (ver `.env.example`). Si `SMTP_HOST` está vacío, la
app funciona igual pero no envía nada. Cada intento queda registrado en la tabla
`email_log` con estado `sent`, `failed` o `skipped`.

| Correo                 | Cuándo se envía                                                                                                       |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Aceptación             | Alguien envía la solicitud de colaborador y hay cupo (`JOIN_CAPACITY`, 35 por defecto). Incluye los datos `EVENT_*`.  |
| Cupo lleno             | Alguien envía la solicitud y ya no hay cupo. Queda en lista de espera.                                                |
| Aceptación (promoción) | Un admin rechaza o manda a espera a alguien aceptado: el más antiguo de la lista de espera toma el lugar.             |
| Gracias por donar      | Un admin registra una donación con correo del donador. Menciona croqueta, dinero (`DONATION_MXN_PER_KG`) y artículos. |

Las donaciones en dinero cuentan para la meta con su equivalente en croqueta
(20 MXN = 1 kg por defecto), guardado al momento de registrarlas.

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
