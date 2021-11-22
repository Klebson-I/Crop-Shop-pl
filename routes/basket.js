const express=require('express');
const basketRouter=express.Router();
const {basket} = require('../dbs/basketDB.js');
const { giveAmountBackToDatabase, getMaxAmountForClient, checkAndChangeLogged} = require('../utils/helpFunctions.js');
const {productDb} = require('../dbs/allProductsDB.js')

basketRouter
    .get('/',async (req,res)=>{
        await checkAndChangeLogged();
        const data=await basket.load();
        let sum;
        if(data.length){
            sum=await basket.sumAll();
        }else{
            sum=0;
        }
        if(data.length){
            res.render('basket/basket',{
                product:data,
                sum
            });
        }
        else{
            res.render('basket/basket-empty');
        }
    })
    .delete('/:name',async (req,res)=>{
        const name=req.params.name;
        await giveAmountBackToDatabase(name,req);
        await basket.remove(name);
        res.render('products/product-deleted',{
            name
        });
    })
    .put('/:name',async (req,res)=>{
        const name=req.params.name;
        console.log("name in basket.js "+name);
        await giveAmountBackToDatabase(name,req);
        await basket.remove(name);
        const obj=await productDb.findOneProduct(name,req);
        const finalObj=getMaxAmountForClient(obj);
        console.log(finalObj);
        res.render('products/editProduct',{
            product:finalObj,
        })
    })



module.exports = {
    basketRouter,
}