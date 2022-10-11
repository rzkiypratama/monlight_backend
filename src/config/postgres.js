const { Pool } = require("pg");
require("dotenv").config();

const database = new Pool({
    host: process.env.db_host_dev,
    user: process.env.db_user_dev,
    database: process.env.db_database_dev,
    password: process.env.db_password_dev,
    port: process.env.db_port_dev,
});

module.exports = database;

// https://documenter.getpostman.com/view/23707125/2s83ziQQUN