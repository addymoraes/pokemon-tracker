import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'password',
    database: 'pokemon_cards',
    port: 5432
});

export default pool;
