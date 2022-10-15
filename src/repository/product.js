const postgreDb = require("../config/postgres");

// const getProduct = () => {
//   return new Promise((resolve, reject) => {
//     const query =
//       "select * from products";
//     postgreDb.query(query, (err, result) => {
//       if (err) {
//         console.log(err);
//         return reject(err);
//       }
//       return resolve(result);
//     });
//   });
// };

const getProduct = (queryParams) => {
  return new Promise((resolve, reject) => {
    let query = "select id, product_name, category, price, stock, description, time_upload, product_img from products";
    const values = [];
    const whereParams = Object.keys(queryParams).filter((key) =>
      ["product_name", "category", "price", "stock", "description"].includes(key)
    );
    if (whereParams.length > 0) query += "where ";
    whereParams.forEach((key) => {
      if (values.length > 0) query += "and ";
      query += `lower(${key}) like lower('%' || $${
        values.length + 1
      } || '%') `;
      values.push(String(queryParams[key]));
    });
    const page = Number(queryParams.page);
    const limit = Number(queryParams.limit);
    const offset = (page - 1) * limit;
    query += `limit $${values.length + 1} offset $${values.length + 2}`;
    values.push(limit, offset);
    postgreDb.query(query, values, (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(result);
    });
  });
};

const postProduct = (body, file) => {
  return new Promise((resolve, reject) => {
    // const timestamp = Date.now() / 1000;
    const query = `insert into products (product_name, category, price, description, stock, discount)
      values ($1,$2,$3,$4,$5,$6)`;
    const {
      product_name,
      category,
      price,
      description,
      stock,
      discount,
    } = body;
    const imageurl = `/image/${file.filename}`
    postgreDb.query(
      query,
      [
        product_name,
        category,
        price,
        description,
        stock,
        discount,
      ],
      (err, result) => {
        console.log(err);
        if (err) {
          return reject(err);
        }
        resolve(result);
      },
    );
  });
};

const editProduct = (body, params) => {
  return new Promise((resolve, reject) => {
    let query = "update products set ";
    const values = [];
    Object.keys(body).forEach((key, idx, arr) => {
      if (idx === arr.length - 1) {
        query += `${key} = $${
          idx + 1
        } where id = $${idx + 2}`;
        values.push(body[key], params.id);
        return;
      }
      query += `${key} = $${idx + 1},`;
      values.push(body[key]);
    });
    postgreDb
      .query(query, values)
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

const clearProduct = (params) => {
  return new Promise((resolve, reject) => {
    let id = params.id;
    postgreDb.query(`DELETE FROM products WHERE id = ${id}`, (err) => {
      //if(err) throw err
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

const searchProduct = (params) => {
  return new Promise((resolve, reject) => {
    const query =
      "select * from products where lower(product_name) like lower($1) or lower(category) like lower($2)";
    const values = [`%${params.product_name}%`, `%${params.category}%`];
    postgreDb.query(
      query,
      values,
      (err, result) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        return resolve(result);
      },
    );
  });
};

const filterProduct = (params) => {
  return new Promise((resolve, reject) => {
    const query =
      "select * from products where order by asc lower(category) like lower($1)";
    const values = [`${params.category}`];
    postgreDb.query(
      query,
      values,
      (err, result) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        return resolve(result);
      },
    );
  });
};

const sortsProduct = (queryParams) => {
  return new Promise((resolve, reject) => {
    let query =
      "select id, product_name, price, time_upload, product_image from products";
      if (queryParams.price == "cheap") {
        query += " order by price asc";
      }
      if (queryParams.price == "exp") {
        query += " order by price desc";
      }
      if (queryParams.post == "old") {
        query += " order by time_upload asc";
      }
      if (queryParams.post == "new") {
        query += " order by time_upload desc";
      }
    postgreDb.query(query, (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(result);
    });
  });
};

// const sortsProduct = () => {
//   return new Promise((resolve, reject) => {
//     const query =
//       "select id, product_name, price from products order by price asc";
//     postgreDb.query(query, (err, result) => {
//       if (err) {
//         console.log(err);
//         return reject(err);
//       }
//       return resolve(result);
//     });
//   });
// };

const usersRepo = {
  getProduct,
  postProduct,
  editProduct,
  clearProduct,
  searchProduct,
  filterProduct,
  sortsProduct,
};

module.exports = usersRepo;
