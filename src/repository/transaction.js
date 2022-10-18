const postgreDb = require("../config/postgres");

const getTransaction = () => {
    return new Promise((resolve, reject) => {
      const query =
            "select * from transactions";
        postgreDb.query(query, (err, result) =>{
            if (err) {
                console.log(err);
                return reject(err)
            }
            return resolve(result)
        });
    });
};

const postTransaction = (body) => {
    return new Promise((resolve, reject) => {
      const query = `insert into transactions (user_id, tax, payment_id, delivery_id, promo_id, product_id, qty, size_id, subtotal, status_id)
      values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`;
    const {
      user_id, tax, payment_id, delivery_id, promo_id, product_id, qty, size_id, subtotal, status_id,
    } = body;
    postgreDb.query(
      query,
      [
        user_id, tax, payment_id, delivery_id, promo_id, product_id, qty, size_id, subtotal, status_id,
      ],
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

const editTransaction = (body, params) => {
    return new Promise ((resolve, reject) => {
      let query = "update transactions set ";
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

const clearTransaction = (params) => {
    return new Promise((resolve, reject) => {
        let id = params.id;
        postgreDb.query(`DELETE FROM transactions WHERE id = ${id}`, (err) => {
          //if(err) throw err
          if (err) {
           return reject(err)
          }
          resolve()
        });
    })
}



const transactionsRepo = {
    getTransaction, postTransaction, editTransaction, clearTransaction,
}

module.exports = transactionsRepo