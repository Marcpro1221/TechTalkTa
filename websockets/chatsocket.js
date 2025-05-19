import {io} from '../app.js';

io.use((socket, next)=>{
    const token = socket.handshake.auth.token;
    try{
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        socket.user = {id: decoded.userId}
    }catch(error){
        console.error('Token is not valid:', error.stack);
        return next(new Error('Authentication error'));
    }
});
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