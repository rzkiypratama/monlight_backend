const express = require("express");

const postgreDb = require("./src/config/postgres");

const mainRouter = require("./src/routes/main");
// init express application
const server = express();

const PORT = 8081;

// db konakin dulu baru jalanin server

postgreDb
  .connect()
  .then(() => {
    console.log("DB connected");

    server.use(express.json());
    server.use(express.urlencoded({ extended: false }))
    // extend false supaya parsing make querystring

    server.use(mainRouter);

    server.get("/", (req, res) => {
      res.json({
        msg: "Semangat brooow",
      });
    });
    



    //   ini server
    server.listen(PORT, () => {
      console.log(`Server is running at port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
