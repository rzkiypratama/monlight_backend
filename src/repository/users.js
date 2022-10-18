const postgreDb = require("../config/postgres");
const bcrypt = require("bcrypt");


const allRegUser = () => {
  return new Promise((resolve, reject) => {
    const query = "select * from users";
    postgreDb.query(query, (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(result);
    });
  });
};

const getUser = () => {
  return new Promise((resolve, reject) => {
    const query = "select * from users_profile";
    postgreDb.query(query, (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(result);
    });
  });
};

const postUser = (body, file) => {
  return new Promise((resolve, reject) => {
    const query = `insert into profile (username, display_name, gender, birthday, phone, address, image)
        values ($1,$2,$3,$4,$5,$6,$7)`;
    const {
      username, display_name, gender, birthday, phone, address
    } = body;
    let imageUrl = null;
    if (file) {
      imageUrl = "/images/" + file.filename;
    }
    postgreDb.query(
      query,
      [
        username, display_name, gender, birthday, phone, address, imageUrl
      ],
      (err, result) => {
        console.log(err);
        if (err) {
          return reject(err);
        }
        resolve(result);
      },
    );
  });
};

const editUser = (body, params) => {
  return new Promise((resolve, reject) => {
    let query = "update users_profile set ";
    const values = [];
    Object.keys(body).forEach((key, idx, arr) => {
      if (idx === arr.length - 1) {
        query += `${key} = $${idx + 1
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
        console.log(err);
        reject(err);
      });
  });
};

const clearUser = (params) => {
  return new Promise((resolve, reject) => {
    let id = params.id;
    postgreDb.query(
      `DELETE FROM users_profile WHERE id = ${id}`,
      (err) => {
        //if(err) throw err
        if (err) {
          return reject(err);
        }
        resolve();
      },
    );
  });
};

// const regUser = (body) => {
//   return new Promise((resolve, reject) => {
    
//     // if (typeof password kurang dari 6) maka return "password harus memuat 1 huruf besar dan 1 simbol (!@#$%^&*)"
//     // email tidak boleh duplikat
//     /* cek apakah email ada di body db, kalo ada rejek status 400 bad req 
//       kalau tidak, lanjut hash*/
//     const query =
//       "insert into users (email, password) values($1, $2) returning id";
//     const {
//       email,
//       password,
//     } = body;
//     // validasi
//     // hash pwd
//     bcrypt.hash(password, 10, (err, hashPwd) => {
//       if (err) {
//         console.log(err);
//         return reject(err);
//       }
//       const values = [
//         email,
//         hashPwd,
//       ];
//       postgreDb.query(
//         query,
//         values,
//         (err, result) => {
//           if (err) {
//             console.log(err);
//             return reject(err);
//           }
//           return resolve(result);
//           },
//     );
//         })    });
//   };
        

const regUser = (body) => {
  return new Promise((resolve, reject) => {
    const queries = {
      checkEmailandPhone:
        "select p.phone, u.email from profile p left join users u on u.id = p.user_id where phone = $1 or email = $2",
      userInsert:
        "insert into users(email, password, created_at, update_at, role_id) values($1, $2, to_timestamp($3), to_timestamp($4), $5) returning id",
      profileInsert:
        "insert into profile(user_id, phone, created_at, update_at) values($1, $2, to_timestamp($3), to_timestamp($4))",
    };
    const { checkEmailandPhone, userInsert, profileInsert } = queries;
    const timeStamp = Date.now() / 1000;
    const { email, password, phone } = body;

    postgreDb.query(
      checkEmailandPhone,
      [phone, email],
      (error, checkResult) => {
        if (error) {
          console.log(error);
          return reject({ error });
        }
        if (checkResult.rows.length > 0) {
          const errorMessage = [];
          if (
            checkResult.rows.length > 1 ||
            (checkResult.rows[0].phone == phone &&
              checkResult.rows[0].email == email)
          )
            errorMessage.push("Email and phone number already exist", 403);

          if (checkResult.rows[0].phone == phone)
            errorMessage.push("Email and phone number already exist", 403);
          if (checkResult.rows[0].email == email)
            errorMessage.push("Email and phone number already exist", 403);
          return reject({
            error: new Error(errorMessage[0]),
            statusCode: errorMessage[1],
          });
        }
        bcrypt.hash(password, 10, (error, hashedPwd) => {
          if (error) {
            console.log(error);
            return reject({ error });
          }
          const role = 1;
          postgreDb.query(
            userInsert,
            [email, hashedPwd, timeStamp, timeStamp, role],
            (error, result) => {
              if (error) {
                console.log(error);
                return reject({ error });
              }
              postgreDb.query(
                profileInsert,
                [result.rows[0].id, phone, timeStamp, timeStamp],
                (error, result) => {
                  if (error) {
                    console.log(error);
                    return reject({ error });
                  }
                  return resolve(result);
                }
              );
            }
          );
        });
      }
    );
  });
};

      
const editPwd = (body) => {
return new Promise ((resolve, reject) => {
const { old_password, new_password, user_id} = body
const getPwdQuery = "select password from users where id = $1";
const getPwdValues = [user_id]
postgreDb.query(getPwdQuery, getPwdValues, (err, response) => {
  if (err) {
    console.log(err)
    return reject({err})
  }
const hashedPassword = response.rows[0].password;
bcrypt.compare(old_password, hashedPassword, (err, isSame) => {
if(err){
  console.log(err);
  return reject({err})
}
if (!isSame) return reject({err: new Error("Old password is wrong"), statusCode: 401})
bcrypt.hash(new_password, 10, (err, newHashedPassword) => {
  if(err) {
    console.log(err)
    return reject({err})
  }
  const editPwdQuery = "update users set password = $1 where id = $2"
  const editPwdValues = [newHashedPassword, user_id];
  postgreDb.query(editPwdQuery, editPwdValues, (err, response) => {
    if (err) {
      console.log(err);
      return reject({err})
    }
    return resolve(response);
})
})
}) 
})
})
}


const usersRepo = {
  getUser,
  postUser,
  editUser,
  clearUser,
  regUser,
  editPwd,
  allRegUser
};

module.exports = usersRepo;
