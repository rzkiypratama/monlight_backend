const postgreDb = require("../config/postgres");

const getProduct = () => {
    return new Promise((resolve, reject) => {
      const query =
            "select id, product_name, price, stock, category, discount from products";
        postgreDb.query(query, (err, result) =>{
            if (err) {
                console.log(err);
                return reject(err)
            }
            return resolve(result)
        });
    });
};

const postProduct = (body) => {
    return new Promise((resolve, reject) => {
      const query = `insert into products (product_name, category, price, stock, discount)
      values ($1,$2,$3,$4,$5)`;
      const { product_name, category, price, stock, discount } = req.body;
      postgreDb.query(
        query,
        [product_name, category, price, stock, discount],
          (err, result) => {
            console.log(err);
            if (err) {
                return reject(err);
            };
           resolve(result)
          }
        );
    });
};

const editProduct = (body, params) => {
    return new Promise ((resolve, reject) => {
      let query = "update products set ";
    const values = [];
    Object.keys(body).forEach((key, idx, arr) => {
      if (idx === arr.length - 1) {
        query += `${key} = $${idx + 1} where id = $${idx + 2}`;
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
    })
}

const clearProduct = (params) => {
    return new Promise((resolve, reject) => {
        let id = params.id;
        postgreDb.query(`DELETE FROM products WHERE id = ${id}`, (err) => {
          //if(err) throw err
          if (err) {
           return reject(err)
          }
          resolve()
        });
    })
}

const filterProduct = (params) => {
  return new Promise((resolve, reject) => {
    const query = "select * from products where lower(category) like lower($1) order by id asc"
    const values = [`${params.category}`,]
    postgreDb.query(query, values, (err, result) => {
      if (err) {
        console.log(err);
        return reject(err)
      }
      return resolve(result)
    })
  })
};


const searchProduct = (params) => {
  return new Promise((resolve, reject) => {
    const query = "select * from products where lower(product_name) like lower($1)"
    const values = [`${params.product_name}`,]
    postgreDb.query(query, values, (err, result) => {
      if (err) {
        console.log(err);
        return reject(err)
      }
      return resolve(result)
    })
  })
};

const usersRepo = {
    getProduct, postProduct, editProduct, clearProduct, searchProduct, filterProduct
}

module.exports = usersRepo