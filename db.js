
const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'hoby',
  password: 'sergyoubi',
  host: 'localhost',
  port: 5432,
  database: 'blog'
});

module.exports = pool;

