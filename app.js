import express from 'express';
import {Server} from 'socket.io';
import bodyParser from 'body-parser';
import {createServer} from 'http';
import {dirname} from 'path';
import path from 'path';
import { fileURLToPath} from 'url';
import login from './routes/login_page.js';
import signup from './routes/signup_page.js';
import { tokenAuthentication} from './routes/verify.js';

const app = express();
const port = 8080;
const server = createServer(app);
export const io = new Server(server);
export const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(bodyParser.urlencoded({ extended: false}));
const partialHomePage = (req, res)=>{
    res.render('partial/home');
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/', login);
app.use('/', signup);   
app.get('/', partialHomePage);
app.use(express.static('public'));
app.get('/session', tokenAuthentication, async (req,res)=>{
    res.render('partials/friendlist'); // ejs file
});
app.get('/logout', (req, res)=>{
    res.clearCookie('token');
    res.redirect('/login');
});
server.listen(port, ()=>{
    console.log(`Server is listening on http://localhost:${port}`);
});



