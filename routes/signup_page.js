import express from 'express';
import client from '../app.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


const router = express.Router();
dotenv.config();
var flag = 1;
router.get('/signup',(req, res)=>{
    res.render('partials/loginAndSignup', {showLogin:false, showsignup: true});
});

router.post('/signup', async (req, res)=>{

    const {signup_userName, signup_passWord} = req.body;
    try{
        const data  = await client.query(`SELECT * FROM login_credentials WHERE name = $1;`, [signup_userName]);
        if(data.rows.length !== 0){
            console.log("Username already exists");
            return res.status(400).send(`<script> alert("Username already exists"); window.location.href = '/signup'; </script>`);
        }
        if(/[^a-zA-Z0-9_]/.test(signup_userName) || /\s/.test(signup_passWord)){ 
            flag = 0;
            return res.status(400).send(`
            <script>alert("Username cannot contain space and special character"); window.location.href='/signup';</script>`);
        }else{
            const hash = await bcrypt.hash(signup_passWord, 10);
            await client.query(`INSERT INTO login_credentials (name, password) VALUES ($1, $2)`, [signup_userName, hash]); // storing hash password to database
            console.log('Sign up successfully');
            flag = 1;
        }
        if(flag){
            const token = jwt.sign({
                username: signup_userName
            },process.env.SECRET_KEY);
             console.log(token);
        }
       
    }catch(error){
        console.error("Error signing up data to database", error.stack);
    }
    res.redirect('/signup');
});


//export section
export default router;