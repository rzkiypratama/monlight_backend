module.exports = (...allowdKeys) => {
  return (req, res, next) => {
    const {body} = req.body;
    const sanitizedKey = Object.keys(body).filter(key =>  allowdKeys.includes(key));
    // tambahkan apakah jumlah key udh sesuai dengan jumlah di alowedkeys 
    const newBody = {};
    for(let key of sanitizedKey){
      Object.assign(newBody, {[key]: body[key]})
    }
    // logik jika newbody kosong response 400
    console.log(newBody)
    req.body = newBody;
    next();
  }
}

// validasi.body ({username: kecuali /?<>,:;'"\|-+!@#$%^&*()_+"})