const Pool = require('pg').Pool;

const pool = new Pool({
    user:'danyleguy',
    host: 'localhost',
    database: 'TicTacToe',
    password: 'HxnE4jP#k*eTxmpBzD@9',
    port: 5432,
});

module.exports = pool;