
const Pool = require('pg').Pool;

const pool = new Pool({
  user: '',
  password: '',
  host: '',
  port: 5432,
  database: 'blog'
});

module.exports = pool;

