const express= require('express');
const {setLogged} = require('../utils/helpFunctions.js');

const adminLogRouter=express.Router();

//it could be cipher
const LOGIN='admin';
const PASSWORD='admin';

adminLogRouter.get('/',(req,res)=>{
    res.render('login/log');
}).post('/',async(req,res)=>{
    const {login,password}=req.body;
    if(login===LOGIN&&password===PASSWORD){
        await setLogged(true);
        res.redirect('/interface');
    }else{
        res.render('error',{
            message:"Błędne hasło lub login",
            link:"/adminLog",
            txt:"Powrót do strony logowania",
        })
    }
})


module.exports = {
    adminLogRouter,
}