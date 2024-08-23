import express from 'express';
import {Server} from 'socket.io';
import bodyParser from 'body-parser';
import {createServer} from 'http';
import {join, dirname} from 'path';
import path from 'path';
import { fileURLToPath} from 'url';
import pg from 'pg';
import jwt from 'jsonwebtoken';
import login from './routes/login_page.js';
import signup from './routes/signup_page.js';
import dotenv from 'dotenv';

const app = express();
const port = 8080;
const server = createServer(app);
const io = new Server(server);
export const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false}));
export const client = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD, // not a proper way to store password
    port: process.env.DB_PORT,
});

client.connect();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/', login);
app.use('/', signup);   
app.get('/',(req,res)=>{
    res.sendFile(join(__dirname, "/index.html"));
})
io.on('connect', (socket) =>{
    console.log('Server is connected');

    socket.on('messages', async (message)=>{
        try{
            await client.query(`INSERT INTO messages_box(sender_id, message_body, send_at) VALUES($1, $2, $3)`, [ 23, message, new Date()]);
            console.log("new data added to database");
        }catch(error){
            console.error('Error in database operation:', error.stack);
        }
        io.emit('send', message);
        console.log(message);
    });

    socket.on('disconnect', ()=>{
        console.log('User disconnected');
    })
});

server.listen(port, ()=>{
    console.log(`Server is listening on http://localhost:${port}`);
});

//export section
export default client;
