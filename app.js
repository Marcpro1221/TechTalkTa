import express from 'express';
import {Server} from 'socket.io';
import {createServer} from 'http';
import {join, dirname} from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 8080 || process.env.port;
const server = createServer(app);
const io = new Server(server);
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static('public'));

app.get('/',(req,res)=>{
    res.sendFile(join(__dirname, "/index.html"));
})
io.on('connect', (socket) =>{
    console.log('Server is connected');

    socket.on('messages', (message)=>{
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