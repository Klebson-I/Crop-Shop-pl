const express=require('express');
const {checkLogged} = require('../utils/helpFunctions.js');
const {salesProduct} = require('../dbs/salesProductsDB.js');
const {productDb} = require('../dbs/allProductsDB.js');

const removerRouter=express.Router();

removerRouter
    .get('/',async (req,res)=>{
    if(await checkLogged()=="true"){
        const products=await salesProduct.getNamesOfProducts();
        res.render('remover/remover',{
            products
        });
    }
    else{
        res.render('error',{
            message:"Nie masz dostępu do tych zasobów",
            link: '/',
            txt :'Powrót do strony głównej'
        })
    }
})
    .delete('/',async (req,res)=>{
        const name=req.body.list;
        const products=await salesProduct.getNamesOfProducts();
        if(products.includes(name)){
            await salesProduct.remove(name);
            await productDb.delete(name);
            res.render('remover/removed',{
                name,
            });
        }else{
            res.render('error',{
                message:`Nie znaleziono produktu o nazwie ${name}`,
                link:'/remover',
                txt:'Powrót do usuwania'
            })
        }
    })

module.exports = {
    removerRouter,
}