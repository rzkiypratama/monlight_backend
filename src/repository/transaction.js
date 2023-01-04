const postgreDb = require("../config/postgres");

const getAllTransaction = () => {
    return new Promise((resolve, reject) => {
      const query =
            "select t.id, t.create_at, p2.display_name, p.product_name, p.image, s.size , p.price,t.qty, pr.code, d.method, py.method, t.subtotal, st.status_name from transactions t join profile p2  on p2.user_id = t.user_id join products p on p.id = t.product_id join sizes s on s.id = t.size_id join promos pr on pr.id = t.promo_id join delivery d on d.id = t.delivery_id join payment py on py.id = t.payment_id join status st on st.id = t.status_id order by create_at desc";
        postgreDb.query(query, (err, result) =>{
            if (err) {
                console.log(err);
                return reject(err)
            }
            return resolve(result)
        });
    });
};

// const getTransaction = (id) => {
//   return new Promise((resolve, reject) => {
//     const query =
//       "select t.create_at, p2.display_name, p.product_name, s.size , p.price, t.qty, pr.code, d.method, py.method, t.subtotal, st.status_name from transactions t join profile p2 on p2.user_id = t.user_id join products p on p.id = t.product_id join sizes s on s.id = t.size_id join promos pr on pr.id = t.promo_id join delivery d on d.id = t.delivery_id join payment py on py.id = t.payment_id join status st on st.id = t.status_id where t.user_id = $1";
//     postgreDb.query(query, [id], (error, result) => {
//       if (error) {
//         console.log(error);
//         return reject({ status: 500, msg: "Internal Server Error" });
//       }
//       if (result.rows.length === 0)
//         return reject({ status: 404, msg: "Transaction cannot be found" });
//       return resolve({
//         status: 200,
//         msg: "Transaction Details",
//         data: { ...result.rows[0] },
//       });
//     });
//   });
// };


// const getTransaction = (id, queryParams) => {
//   return new Promise((resolve, reject) => {
//     const { page, limit } = queryParams;
//     let link = "http://localhost:8181/api/monlight-project/transactions?";
//     const countQuery =
//       "select count(id) as count from transactions where user_id = $1";

//     const query =
//       "select t.id, t.create_at, t.delivery_id, p2.display_name, p.product_name, p.image, s.size , p.price,t.qty, pr.code, d.method, py.method, t.subtotal, st.status_name from transactions t join profile p2  on p2.user_id = t.user_id join products p on p.id = t.product_id join sizes s on s.id = t.size_id join promos pr on pr.id = t.promo_id join delivery d on d.id = t.delivery_id join payment py on py.id = t.payment_id join status st on st.id = t.status_id where t.user_id = $1 order by create_at desc limit $2 offset $3";

//     postgreDb.query(countQuery, [id], (error, result) => {
//       if (error) {
//         console.log(error);
//         return reject({ status: 500, msg: "Internal Server Error" });
//       }
//       if (result.rows.length === 0)
//         return reject({ status: 404, msg: "Data not found" });

//       const totalData = parseInt(result.rows[0].count);
//       const sqlLimit = limit ? limit : 1;
//       const sqlOffset = !page || page === "1" ? 0 : parseInt(page - 1) * limit;
//       const currentPage = page ? parseInt(page) : 1;
//       const totalPage =
//       parseInt(sqlLimit) > totalData
//         ? 1
//         : Math.ceil(totalData / parseInt(sqlLimit));

//     const prev =
//       currentPage - 1 <= 0
//         ? null
//         : link + `page=${currentPage - 1}&limit=${parseInt(sqlLimit)}`;

//     const next =
//       currentPage + 1 >= totalPage
//         ? null
//         : link + `page=${currentPage + 1}&limit=${parseInt(sqlLimit)}`;

//     const meta = {
//       page: currentPage,
//       totalPage,
//       limit: parseInt(sqlLimit),
//       totalData: parseInt(totalData),
//       prev,
//       next,
//     };
//       console.log(totalPage, currentPage);
//       postgreDb.query(query, [id, sqlLimit, sqlOffset], (error, result) => {
//         if (error) {
//           console.log(error);
//           return reject({ status: 404, msg: "Internal Server Error" });
//         }
//         if (result.rows.length === 0)
//           return reject({ status: 404, msg: "Data not found" });
//         return resolve({
//           status: 200,
//           msg: "List products",
//           data: result.rows,
//           meta,
//         });
//       });
//     });
//   });
// };

const getTransaction = (id, queryParams) => {
  return new Promise((resolve, reject) => {
    const { page, limit } = queryParams;
    
    const query =
    "select t.id, t.create_at, t.delivery_id, u.display_name, p.product_name, p.image, s.size , p.price,t.qty, pr.code, d.method, py.method, t.subtotal, t.subtotal, st.status_name from transactions t join profile u on u.user_id = t.user_id join products p on p.id = t.product_id join sizes s on s.id = t.size_id join promos pr on pr.id = t.promo_id join delivery d on d.id = t.delivery_id join payment py on py.id = t.payment_id join status st on st.id = t.status_id where t.user_id = $1 order by create_at desc limit $2 offset $3";

    const countQuery =
    "select count(id) as count from transactions where user_id = $1";

    let link = "http://localhost:8181/api/monlight-project/transactions?";
    
    postgreDb.query(countQuery, [id], (error, result) => {
      if (error) {
        console.log(error);
        return reject({ status: 500, msg: "Internal Server Error" });
      }
      if (result.rows.length === 0)
        return reject({ status: 404, msg: "Data not found" });
      const totalData = parseInt(result.rows[0].count);
      const sqlLimit = !limit ? 8 : parseInt(limit);
      const sqlOffset =
        !page || page === "1" ? 0 : parseInt(page - 1) * limit;
      const currentPage = page ? parseInt(page) : 1;
      const totalPage =
        parseInt(sqlLimit) > totalData
          ? 1
          : Math.ceil(totalData / parseInt(sqlLimit));

      const prev =
        currentPage === 1
          ? null
          : link + `page=${currentPage - 1}&limit=${parseInt(sqlLimit)}`;

      const next =
        currentPage === totalPage
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
      postgreDb.query(query, [id, sqlLimit, sqlOffset], (error, result) => {
        if (error) {
          console.log(error);
          return reject({ status: 404, msg: "Internal Server Error" });
        }
        if (result.rows.length === 0)
          return reject({ status: 404, msg: "Data not found" });
        return resolve({
          status: 200,
          msg: "Transactions History",
          data: result.rows,
          meta,
        });
      });
    });
  });
};

const postTransaction = (body, id) => {
  return new Promise((resolve, reject) => {
    const query =
      "insert into transactions (user_id, product_id, size_id, promo_id, payment_id, delivery_id, qty, subtotal, status_id, create_at) values($1, $2, $3, $4, $5, $6, $7, $8, $9, to_timestamp($10))";
    const {
      product_id,
      size_id,
      promo_id,
      payment_id,
      delivery_id,
      qty,
      subtotal,
      status_id,
    } = body;
    const timeStamp = Date.now() / 1000;
    const user_id = id;
    const values = [
      user_id,
      product_id,
      size_id,
      promo_id,
      payment_id,
      delivery_id,
      qty,
      subtotal,
      status_id,
      timeStamp,
    ];

    // return console.log(values);

    postgreDb.query(query, values, (error, result) => {
      if (error) return reject(error);
      return resolve(result);
    });
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
    getTransaction, postTransaction, editTransaction, clearTransaction, getAllTransaction
}

module.exports = transactionsRepo