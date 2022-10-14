const postgreDb = require("../config/postgres");

const getUser = () => {
    return new Promise((resolve, reject) => {
      const query = "select * from users";
        postgreDb.query(query, (err, result) =>{
            if (err) {
                console.log(err);
                return reject(err)
            }
            return resolve(result)
        });
    });
};

const postUser = (body) => {
    return new Promise((resolve, reject) => {
        const query = `insert into users (email, password, phone, display_name, first_name, last_name, gender, delivery_address, create_at)
        values ($1,$2,$3,$4,$5,$6,$7,$8,$9)`;
        const {
          email,
          password,
          phone,
          display_name,
          first_name,
          last_name,
          gender,
          delivery_address,
          create_at,
        } = body;
        postgreDb.query(
          query,
          [
            email,
            password,
            phone,
            display_name,
            first_name,
            last_name,
            gender,
            delivery_address,
            create_at,
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

const editUser = (body, params) => {
    return new Promise ((resolve, reject) => {
        let query = "update users set ";
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

const clearUser = (params) => {
    return new Promise((resolve, reject) => {
        let id = params.id;
        postgreDb.query(`DELETE FROM users WHERE id = ${id}`, (err) => {
          //if(err) throw err
          if (err) {
           return reject(err)
          }
          resolve()
        });
    })
}


const usersRepo = {
    getUser, postUser, editUser, clearUser,
}

module.exports = usersRepo