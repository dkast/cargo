[![DeepSource](https://app.deepsource.com/gh/dkast/cargo.svg/?label=active+issues&show_trend=true&token=zZptTKiOmCdRIxR2IQMHpL47)](https://app.deepsource.com/gh/dkast/cargo/)

# 📌 Overview

Cargo is a logistic application for C-TPAT inspections. It utilizes various libraries and tools such as Prisma, Next.js, React, Tailwind CSS, and more.

## ⚙️ Setting Up

#### DATABASE_URL

- The value for this variable depends on the type of database you are using.
- If you are using SQLite, you can use the provided value: "file:./db.sqlite".
- If you are using a different database, replace the value with the appropriate connection URL.

#### NEXTAUTH_SECRET

- Generate a new secret key using the command: openssl rand -base64 32.
- Copy the generated key and assign it as the value for this variable.

#### NEXTAUTH_URL

- Set this variable to the URL where your application will be hosted. For example, `"http://localhost:3000"` for local development or `"https://example.com"` for production.

### Configure your Cloudflare R2 Storage

#### R2_ACCOUNT_ID

#### R2_ACCESS_KEY_ID

#### R2_SECRET_KEY_ID

#### R2_BUCKET_NAME

## 🚀 Run Locally

1.Clone the cargo repository:

```sh
git clone https://github.com/dkast/cargo
```

2.Install the dependencies with one of the package managers listed below:

```bash
pnpm install
```

3.Start the development mode:

```bash
pnpm dev
```

## ☁️ Deploy

[Cargo](https://cargohq.vercel.app/)

## 📄 License

This project is licensed under the **GNU Affero General Public License v3.0** - see the [**GNU Affero General Public License v3.0**](https://github.com/dkast/cargo/blob/main/LICENSE) file for details.
