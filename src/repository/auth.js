const postgreDb = require("../config/postgres")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
 
module.exports = {
  login: (body) => {
    return new Promise((resolve, reject) => {
      const {email, password} = body;
      const getPasswordByEmailQuery = "select id, password from users where email = $1"
      const getPasswordByEmailValue = [email]
      postgreDb.query(getPasswordByEmailQuery, getPasswordByEmailValue, (err, response) => {
        if(err) {
          console.log(err)
          return reject(err)
        }
        if(response.rows.length === 0) return reject({err: new Error("Email/Password is Wrong"), statusCode: 401})
        // pw di db === pw diinput?
        const hashedPassword= response.rows[0].password
        bcrypt.compare(password, hashedPassword, (err, isSame) => {
          if(err) {
            console.log(err)
            return reject(err)
          }
          if (!isSame) return reject({err: new Error("Email/Password slaaah cok"), statusCode: 401})
        })
        // asumsi sudah login
        const payload = {
          username: response.rows[0].body,
          email: response.rows[0].email,
          user_id: response.rows[0].id,
        }
        jwt.sign(payload, process.env.secret_key, {expiresIn: "10m", 
        issuer: process.env.issuer}, 
        (err, token) => {
 if(err) {
  console.log(err);
  return reject({err})
 }
 return resolve({token, name: payload.username})
        })
        }
      )
    })
  },
};