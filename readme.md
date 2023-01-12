# Monlight Coffeshop Backend

Codebase containing CRUD and auth to provide client side for our [project](##Related)

[![dotenv](https://img.shields.io/badge/dotenv-16.0.3-blue)](https://www.npmjs.com/package/dotenv)
[![express](https://img.shields.io/badge/express-4.18.1-blue)](https://www.npmjs.com/package/express)
[![bcrypt](https://img.shields.io/badge/bcrypt-5.0.1-blue)](https://www.npmjs.com/package/bcrypt)
[![jsonwebtoken](https://img.shields.io/badge/jsonwebtoken-8.5.1-blue)](https://www.npmjs.com/package/jsonwebtoken)
[![multer](https://img.shields.io/badge/multer-1.4.4-blue)](https://www.npmjs.com/package/multer)
[![morgan](https://img.shields.io/badge/morgan-1.10.0-blue)](https://www.npmjs.com/package/morganr)
[![postgreSQL](https://img.shields.io/badge/pg-8.8.0-blue)](https://www.npmjs.com/package/morganr)

# Installation

## 1. Clone this repository

Clone this repository by run the following code:

```
git clone https://github.com/rzkiyprtm/monlight_backend.git
```

## 2. Go to directory

```
cd monlight_backend
```

## 3. Install dependency packages

Install dependency packages by run the following code inside project folder:

```
npm install / npm i
```

## Documentation

[Documentation](https://github.com/rzkiyprtm/monlight_backend.git)

## Features

- Auth
  - login
  - logout
- Product
  - Get Product
  - Edit
  - Delete
  - Update
- Users
  - Register
  - Edit password
  - Update profile
- Transactions
  - Get transaction history
  - Create transaction
  - Edit transaction
  - Delete transactions
- Promos
  - Get Promos
  - Create
  - Update
  - Delete

## Related Project
* [`Monlight Cafe & Bar Frontend`](https://github.com/rzkiyprtm/react-monlight-app)



```http
  GET, POST /products
```

```http
  GET, POST, PATCH, DELETE /products/${id}
```

```http
  GET, POST, UPDATE /transasction
```

```http
  DELETE /transasction/${id}
```

## Authors

- [@rzkiypratama](https://github.com/rzkiyprtm)
