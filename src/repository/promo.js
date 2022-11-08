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

const editPromo = (body, params) => {
  return new Promise((resolve, reject) => {
    let query = "update promos set ";
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
  searchPromo
};

module.exports = promosRepo;
