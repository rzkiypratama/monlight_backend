const postgreDb = require("../config/postgres");

const getProduct = (queryParams) => {
  return new Promise((resolve, reject) => {
    const { search, categories, sort, limit, page } = queryParams;
    let query =
      "select p.product_name, p.price, p.image, c.category_name, p.description from products p full outer join categories c on c.id = p.category_id left join transactions t on t.product_id = p.id ";
    let countQuery =
      "select count(*) as count from products p full outer join categories c on c.id = p.category_id left join transactions t on t.product_id = p.id ";

    let checkWhere = true;
    let link = "http://localhost:8181/api/monlight-project/products/get?";

    if (search) {
      link += `search${search}&`;
      query += `${
        checkWhere ? "WHERE" : "AND"
      } lower(p.product_name) like lower('%${search}%') `;
      countQuery += `${
        checkWhere ? "WHERE" : "AND"
      } lower(p.product_name) like lower('%${search}%') `;
      checkWhere = false;
    }

    if (categories && categories !== "") {
      query += `${
        checkWhere ? "WHERE" : "AND"
      } lower(c.category_name) like lower('${categories}') `;

      countQuery += `${
        checkWhere ? "WHERE" : "AND"
      } lower(c.category_name) like lower('${categories}') `;

      checkWhere = false;
      link += `categories=${categories}&`;
    }

    if (sort) {
      query += "group by p.id, c.category_name ";
      if (sort.toLowerCase() === "popular") {
        query += "order by count(t.qty) desc ";
        link += "sort=popular&";
      }
      if (sort.toLowerCase() === "oldest") {
        query += "order by p.created_at asc ";
        link += "sort=oldest&";
      }
      if (sort.toLowerCase() === "newest") {
        query += "order by p.created_at desc ";
        link += "sort=newest&";
      }
      if (sort.toLowerCase() === "cheapest") {
        query += "order by p.price asc ";
        link += "sort=cheapest&";
      }
      if (sort.toLowerCase() === "priciest") {
        query += "order by p.price desc ";
        link += "sort=priciest&";
      }
    }
    query += "limit $1 offset $2";
    console.log(query);
    console.log(link);
    const sqlLimit = limit ? limit : 10;
    const sqlOffset =
      !page || page === "1" ? 0 : (parseInt(page) - 1) * parseInt(sqlLimit);

    // console.log(countQuery);
    console.log(sqlLimit);
    postgreDb.query(countQuery, (err, result) => {
      if (err) return reject(err);
      // return resolve(result.rows);
      const totalData = result.rows[0].count;
      const currentPage = page ? parseInt(page) : 1;
      const totalPage =
        parseInt(sqlLimit) > totalData
          ? 1
          : Math.ceil(totalData / parseInt(sqlLimit));

      const prev =
        currentPage - 1 <= 0
          ? null
          : link + `page=${currentPage - 1}&limit=${parseInt(sqlLimit)}`;

      const next =
        currentPage + 1 >= totalPage
          ? null
          : link + `page=${currentPage + 1}&limit=${parseInt(sqlLimit)}`;

      const meta = {
        page: currentPage,
        totalPage,
        limit: parseInt(sqlLimit),
        totalData,
        prev,
        next,
      };
      console.log(totalPage, currentPage);
      postgreDb.query(query, [sqlLimit, sqlOffset], (error, result) => {
        if (error) {
          console.log(error);
          return reject(error);
        }
        return resolve({
          result: {
            msg: "List products",
            data: result.rows,
            meta,
          },
        });
      });
    });
  });
};


const postProduct = (body, file) => {
  return new Promise((resolve, reject) => {
    const query =
      "insert into products (product_name, price, image, category_id, description) values ($1, $2, $3, $4, $5)";
    const { product_name, price, category_id, description } = body;
    let imageUrl = null;
    if (file) {
      imageUrl = "/images/" + file.filename;
    }
    // const imageUrl = `/images/${file.filename}`;
    postgreDb.query(
      query,
      [
        product_name,
        price,
        imageUrl,
        category_id,
        description,
      ],
      (err, queryResult) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        resolve(queryResult);
      }
    );
  });
};

// const editProduct = (body, params) => {
//   return new Promise((resolve, reject) => {
//     let query = "update products set ";
//     const values = [];
//     Object.keys(body).forEach((key, idx, arr) => {
//       if (idx === arr.length - 1) {
//         query += `${key} = $${
//           idx + 1
//         } where id = $${idx + 2}`;
//         values.push(body[key], params.id);
//         return;
//       }
//       query += `${key} = $${idx + 1},`;
//       values.push(body[key]);
//     });
//     postgreDb
//       .query(query, values)
//       .then((response) => {
//         resolve(response);
//       })
//       .catch((err) => {
//         console.log(err);
//         reject(err);
//       });
//   });
// };


const editProduct = (body, params, file) => {
  return new Promise((resolve, reject) => {
    let query = "update products set ";
    const values = [];
    if (file) {
      if (Object.keys(body).length === 0) {
        const imageUrl = `/image/${file.filename}`;
        query += `image = '${imageUrl}' where id = $1 returning product_name`;
        values.push(params.id)
      }
      if (Object.keys(body).length > 0) {
        const imageUrl = `/image/${file.filename}`;
        query += `image = '${imageUrl}',`;
    }
    }
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
