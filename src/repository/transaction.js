const postgreDb = require("../config/postgres");

const getTransaction = () => {
    return new Promise((resolve, reject) => {
      const query =
            "select id, product_name, quantity, price, beverage_size, order_method, payment_method, time_order, ordered_by, shipping, tax, total_payment from transactions";
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
      const query = `insert into transactions (product_name, quantity, price, beverage_size, order_method, payment_method, time_order, ordered_by, shipping, tax, total_payment)
      values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`;
    const {
      product_name,
      quantity,
      price,
      beverage_size,
      order_method,
      payment_method,
      time_order,
      ordered_by,
      shipping,
      tax,
      total_payment
    } = body;
    postgreDb.query(
      query,
      [
        product_name,
        quantity,
        price,
        beverage_size,
        order_method,
        payment_method,
        time_order,
        ordered_by,
        shipping,
        tax,
        total_payment,
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