import { createPool, Pool } from 'mysql2/promise';
import { config } from 'dotenv';

config();

const pool: Pool = createPool({
    host: process.env.MYSQL_HOSTNAME,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

export default pool;
