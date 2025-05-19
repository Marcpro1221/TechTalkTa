import express from 'express';
import {client} from '../db/connect.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const router = express.Router();
// Middleware for timestamp
const timeLog = (req, res, next) => {
    let timeStamp = new Date(Date.now());
  console.log('Time: ', timeStamp.toString());
  next();
};
router.use(cookieParser()); // middleware
router.get('/login',(req, res)=>{
    res.render('partials/loginAndSignup', {showLogin: true, showsignup: false});
});
router.post('/login', timeLog, async (req, res)=>{  
    const {userName, passWord} = req.body;
    console.log(`User: ${userName}`);
    console.log(`Pass: ${passWord}`);
    try{
        const loginData = await client.query(`SELECT * FROM login_credentials WHERE name = $1`, [userName]);
            if(loginData.rows.length === 0) {
                console.log("Login failed, please try again");
                return res.redirect('/login');
            }
            
        const user = loginData.rows[0];
        const matched = await bcrypt.compare(passWord, user.password);
            if(!matched){
                console.log("Login failed, wrong password!, please try again");
                return res.redirect('/login');
            }else{
                const token = jwt.sign({
                        userId: user.id,
                        username: userName
                    },process.env.SECRET_KEY, {expiresIn: '50m'});
                res.cookie('token', token, {httpOnly: true});
                console.log(`User ID: ${user.id} logged in successfully with socket ID: ${token}`);
                console.log(`Token: ${token}`);
                console.log('Login successfully');
                return res.redirect('/session');
            }
    }catch(error){
        console.error('Login Error, No data matched', error.stack);
        return res.status(500).json({message: "Internal server error"});
    }
});

export default router;
