const postgreDb = require("../config/postgres")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
 
module.exports = {
login: (body) => {
  return new Promise((resolve, reject) => {
    const { email, password } = body;
    const getPasswordQuery =
      "select u.id, u.email, u.password, r.role from users u left join role r on u.role_id = r.id where email = $1";
    const invalidCridentials = new Error("Email/Password is Wrong");
    const statusCode = 401;
    console.log(email, password);
    postgreDb.query(getPasswordQuery, [email], (error, response) => {
      if (error) {
        console.log(error);
        return reject({ error });
      }
      if (response.rows.length === 0)
        return reject({ error: invalidCridentials, statusCode });

      const hashedPassword = response.rows[0].password;
      bcrypt.compare(password, hashedPassword, (error, isSame) => {
        if (error) {
          console.log(error);
          return reject({ error });
        }
        if (!isSame)
          return reject({
            error: invalidCridentials,
            statusCode,
          });

        const payload = {
          id: response.rows[0].id,
          email,
          role: response.rows[0].role,
        };
        jwt.sign(
          payload,
          process.env.secret_key,
          {
            expiresIn: "10m",
          },
          (error, token) => {
            if (error) {
              console.log(error);
              return reject({ error });
            }
            return resolve({ token, payload });
          }
        );
      });
    });
  });
},

  logout: (token) => {
    return new Promise((resolve, reject) => {
      const query = "insert into blacklist(token) values($1)";
      postgreDb.query(query, [token], (error, result) => {
        if (error) {
          console.log(error);
          return reject(error);
        }
        return resolve({ message: "Logout Success." });
      });
    });
  },
};