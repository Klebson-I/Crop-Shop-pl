const express=require('express');
const {checkAndChangeLogged} = require("../utils/helpFunctions.js");
const homeRouter=express.Router();


homeRouter
    .get('/',async(req,res)=>{
        await checkAndChangeLogged();
        res.redirect('/home');
    })
    .get('/home',async(req,res)=>{
        await checkAndChangeLogged();
        res.render('home/home');
    })



module.exports = {
    homeRouter,
}