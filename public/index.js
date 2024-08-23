const form = document.getElementById('form');
const input = document.getElementById('input');
const messageBody = document.getElementById('messages');
const button = document.getElementById('sendBtn');
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    if(input.value){
        socket.emit('messages', input.value);
        input.value = '';
    }
});
    socket.on('send', (messages)=>{
        let message = document.createElement('li');
        message.textContent =  `User: ${messages}`;
        messageBody.appendChild(message);
        console.log(message.textContent)
        window.scrollTo(0, document.body.scrollHeight);
    });
