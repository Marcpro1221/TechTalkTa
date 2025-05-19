import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
export const client = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD, // not a proper way to store password
    port: process.env.DB_PORT,
});
client.connect()
.then(()=>{console.log('connected to the database');})
.catch(error=>{console.error("Database connection error:", error.stack)});
export default client;