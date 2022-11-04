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

const getUser = (id) => {
  return new Promise((resolve, reject) => {
    const query =
      "select p.*, u.email from profile p join users u on u.id = p.user_id where p.user_id =$1";
    postgreDb.query(query, [id], (error, result) => {
      if (error) return reject(error);
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

// const editUser = (body, id, file) => {
//   return new Promise((resolve, reject) => {
//     const timeStamp = Date.now() / 1000;
//     const values = [];
//     let query = "update profile set ";
//     if (file) {
//       if (Object.keys(body).length === 0) {
//         const imageUrl = `/image/${file.filename}`;
//         query += `image = '${imageUrl}' update_at = to_timestamp($1) where user_id = $2 returning display_name`;
//         values.push(timeStamp, id)
//       }
//       if (Object.keys(body).length > 0) {
//         const imageUrl = `/image/${file.filename}`;
//         query += `image = '${imageUrl}',`;
//     }
//     }
//     Object.keys(body).forEach((key, idx, arr) => {
//       if (index === array.length - 1) {
//         query += `${key} = $${index + 1}, update_at = to_timestamp($${
//           index + 2
//         }) where user_id = $${index + 3} returning display_name`;
//         values.push(body[key], timeStamp, id);
//         return;
//       }
//       query += `${key} = $${index + 1}, `;
//       values.push(body[key]);
//     });
//     postgreDb
//       .query(query, values)
//       .then((response) => {
//         resolve(response);
//       })
//       .catch((err) => {
//         console.log(err);
//         reject(err);
//       });
//   });
// };

const editUser = (body, id, file) => {
  return new Promise((resolve, reject) => {
    const timeStamp = Date.now() / 1000;
    const values = [];
    let query = "update profile set ";
    let imageUrl = null;
    if (file) {
      imageUrl = file.filename;
      if (Object.keys(body).length === 0) {
        query += `image = '/${imageUrl}', update_at = to_timestamp($1) where user_id = $2 returning display_name`;
        values.push(timeStamp, id);
      }
      if (Object.keys(body).length > 0) {
        query += `image = '/${imageUrl}', `;
      }
    }
    Object.keys(body).forEach((key, index, array) => {
      if (index === array.length - 1) {
        query += `${key} = $${index + 1}, update_at = to_timestamp($${
          index + 2
        }) where user_id = $${index + 3} returning display_name`;
        values.push(body[key], timeStamp, id);
        return;
      }
      query += `${key} = $${index + 1}, `;
      values.push(body[key]);
    });
    console.log(query);

    postgreDb.query(query, values, (error, result) => {
      if (error) {
        console.log(error);
        return reject({ status: 500, msg: "Internal Server Error" });
      }
      let data = {};
      if (file) data = { Image: imageUrl, ...result.rows[0] };
      data = { Image: imageUrl, ...result.rows[0] };
      return resolve({
        status: 200,
        msg: `${result.rows[0].display_name}, your profile successfully updated`,
        data,
      });
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
            errorMessage.push("Email & phone number has been registered", 403);

          if (checkResult.rows[0].phone == phone)
            errorMessage.push("Email & phone number has been registered", 403);
          if (checkResult.rows[0].email == email)
            errorMessage.push("Email & phone number has been registered", 403);
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
