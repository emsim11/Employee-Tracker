const { Pool } = require('pg');
require('dotenv').config();

const Connection = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: process.env.POSTGRES_PASSWORD,
    database: 'employees',
    port: process.env.PORT || 5432
});

module.exports = Connection;