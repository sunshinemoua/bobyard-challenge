const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "admin123",
  host: "localhost",
  port: 5432,
  database: "sample-project",
});

module.exports = pool;
