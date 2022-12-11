const postgreDb = require("../config/postgres");

const getPromo = () => {
  return new Promise((resolve, reject) => {
    const query = "select * from promos";
    postgreDb.query(query, (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(result);
    });
  });
};

const getPromoById = (id) => {
  return new Promise((resolve, reject) => {
    const query = "select * from promos where id = $1";
    postgreDb.query(query, [id], (error, result) => {
      if (error) {
        console.log(error);
        return reject({ status: 500, msg: "Internal Server Error" });
      }
      if (result.rows.length === 0)
        return reject({ status: 404, msg: "Promo Not Found" });

      return resolve({
        status: 200,
        msg: "Detail Promo",
        data: { ...result.rows[0] },
      });
    });
  });
};

const getPromos = (params) => {
  return new Promise((resolve, reject) => {
    let link = "/api/promos?";
    const { code, page, limit } = params;
    const countQuery =
      "select count(id) as count from promos where lower(code) like lower($1)";
    const query =
      "select * from promos where lower(code) like lower($1) order by created_at desc limit $2 offset $3 ";
    const sqlLimit = !limit ? 4 : parseInt(limit);
    const sqlOffset = !page || page === "1" ? 0 : parseInt(page - 1) * limit;
    let promoCode = "%%";
    if (code) {
      link += `code=${code}`;
      promoCode = `%${code}%`;
    }
    db.query(countQuery, [promoCode], (error, result) => {
      if (error) {
        console.log(error);
        return reject({
          status: 500,
          msg: "Internal server error",
        });
      }
      const totalData = parseInt(result.rows[0].count);
      const currentPage = page ? parseInt(page) : 1;
      const totalPage =
        sqlLimit > totalData ? 1 : Math.ceil(totalData / limit);
      const prev =
        currentPage === 1
          ? null
          : link + `page=${currentPage - 1}&limit=${sqlLimit}`;
      const next =
        currentPage === totalPage
          ? null
          : link + `page=${currentPage + 1}&limit=${sqlLimit}`;
      const meta = {
        page: currentPage,
        totalPage,
        limit: sqlLimit,
        totalData,
        prev,
        next,
      };
      db.query(query, [promoCode, sqlLimit, sqlOffset], (error, result) => {
        if (error) {
          console.log(error);
          return reject({
            status: 500,
            msg: "Internal Server Error",
          });
        }
        if (result.rows.length === 0)
          return reject({ status: 404, msg: "Data not Found" });
        return resolve({
          status: 200,
          msg: "List Promos",
          data: result.rows,
          meta,
        });
      });
    });
  });
};

const postPromo = (body, file) => {
  return new Promise((resolve, reject) => {
    const query =
      "insert into promos(code, discount, description, duration, create_at, update_at, image, promo_name, min_price) values($1, $2, $3, $4, to_timestamp($5), to_timestamp($6), $7, $8, $9) returning *";
    const { code, discount, description, duration, promo_name, min_price } =
      body;
    const imageUrl = `/${file.filename}`;
    const timestamp = Date.now() / 1000;
    postgreDb.query(
      query,
      [
        code.toUpperCase(),
        discount,
        description,
        duration,
        timestamp,
        timestamp,
        imageUrl,
        promo_name,
        min_price,
      ],
      (error, result) => {
        if (error) {
          console.log(error);
          return reject({
            status: 500,
            msg: "Internal Server Error",
          });
        }

        return resolve({
          status: 201,
          msg: `promo ${result.rows[0].code} created sucessfully`,
          data: { ...result.rows[0] },
        });
      }
    );
  });
};

// const editPromo = (body, params) => {
//   return new Promise((resolve, reject) => {
//     const values = [];
//     const timestamp = Date.now() / 1000;
//     let query = "update promos set ";
//     Object.keys(body).forEach((key, index, array) => {
//       if (index === array.length - 1) {
//         query += `${key} = $${index + 1}, update_at = to_timestamp($${
//           index + 2
//         })  where id = $${index + 3}`;
//         values.push(body[key], timestamp, params.id);
//         return;
//       }
//       query += `${key} = $${index + 1}, `;
//       values.push(body[key]);
//     });

//     postgreDb.query(query, values, (error, result) => {
//       if (error) return reject(error);
//       return resolve(result);
//     });
//   });
// };

const editPromo = (body, params, file) => {
  return new Promise((resolve, reject) => {
    const values = [];
    const timestamp = Date.now() / 1000;
    let imageUrl = null;
    let query = "update promos set ";
    if (file) {
      console.log(file)
      imageUrl = `${file.filename}`;
      if (Object.keys(body).length === 0) {
        query += `image = '/${imageUrl}', update_at = to_timestamp($1) where id = $2 returning code`;
        values.push(timestamp, params.id);
      }
      if (Object.keys(body).length > 0) {
        query += `image = '/${imageUrl}', `;
      }
    }

    Object.keys(body).forEach((key, index, array) => {
      if (index === array.length - 1) {
        query += `${key} = $${index + 1}, update_at = to_timestamp($${
          index + 2
        })  where id = $${index + 3} returning code`;
        values.push(body[key], timestamp, params.id);
        return;
      }
      query += `${key} = $${index + 1}, `;
      values.push(body[key]);
    });

    postgreDb.query(query, values, (error, result) => {
      if (error) {
        console.log(error);
        return reject({
          status: 500,
          msg: "Internal Server Error",
        });
      }
      if (result.rows.length === 0)
        return reject({
          status: 404,
          msg: "Update promo failed, promo not found",
        });
      return resolve({
        status: 201,
        msg: `promo ${result.rows[0].code} updated sucessfully`,
        data: { id: params.id, ...body },
      });
    });
  });
};

const clearPromo = (params) => {
  return new Promise((resolve, reject) => {
    let id = params.id;
    postgreDb.query(`DELETE FROM promos WHERE id = ${id}`, (err) => {
      //if(err) throw err
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

const searchPromo = (queryParams) => {
  return new Promise((resolve, reject) => {
    const query = "select * from promos where lower(promo_id) like lower($1) or lower(promo_detail) like lower($2)"
    const values = [`%${queryParams.code_promo}%`, `%${queryParams.detail_promo}%`]
    postgreDb.query(query, values, (err, result) => {
      if (err) {
        console.log(err);
        return reject(err)
      }
      return resolve(result)
    })
  })
}

const promosRepo = {
  getPromo,
  postPromo,
  editPromo,
  clearPromo,
  searchPromo,
  getPromoById
};

module.exports = promosRepo;
