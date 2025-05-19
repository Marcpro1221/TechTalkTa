import jwt from 'jsonwebtoken';

// Middleware to handle login routes authentication
export async function tokenAuthentication(req, res, next){
    const token = req.cookies.token;
    jwt.verify(token, process.env.SECRET_KEY, (err, user)=>{
        if(err){
            return res.status(401).send(`<script> alert("Invalid request, Login must required!"); window.location.href = "/login";</script>`);
        }
        req.user = user;
        next();
    });
};
