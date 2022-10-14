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

const postPromo = (body) => {
  return new Promise((resolve, reject) => {
    const query = `insert into promos (promo_id, promo_detail, promo_value, valid)
      values ($1,$2,$3,$4)`;
    const { promo_id, promo_detail, promo_value, valid} = body;
    postgreDb.query(query, [promo_id, promo_detail, promo_value, valid], (err, result) => {
      console.log(err);
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
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
