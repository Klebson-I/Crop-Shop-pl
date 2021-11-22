const express=require('express');
const {checkAndChangeLogged} = require("../utils/helpFunctions.js");
const aboutUsRouter=express.Router();

aboutUsRouter
    .get('/',async(req,res)=>{
        await checkAndChangeLogged();
        res.redirect('/home');
    })


module.exports = {
    aboutUsRouter,
}