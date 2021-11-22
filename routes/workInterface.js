const express=require('express');
const {checkLogged} = require('../utils/helpFunctions.js');
const {basket} = require('../dbs/basketDB.js');
const {productDb} = require('../dbs/allProductsDB.js');
const {salesProduct} = require('../dbs/salesProductsDB.js');
const interfaceRouter=express.Router();

interfaceRouter.get('/',async(req,res)=>{
    const products=await salesProduct.load();
    const actualInSaleProducts=await productDb.load();
    products.forEach((obj,i,arr)=>{
        const names=actualInSaleProducts.map(obj=>obj.name);
        if(names.includes(obj.name)){
            arr[i]={
                ...obj,
                isActual:true,
            }
        }
    })
    console.log(products);


    if(await checkLogged()=="true"){
        res.render('interface/interface',{
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
}).get('/:name',async(req,res)=>{
    const name=req.params.name;
    const product=await salesProduct.findOne(name);
    const {price, img}=product;

    if(await checkLogged()=="true"){
        res.render('interface/singleProduct',{
            name,
            img,
            price
        })
    }
}).post('/:name',async(req,res)=>{
    const {quantity}=req.body;
    const name=req.params.name;
    if(await salesProduct.checkName(name)){
        await salesProduct.addProductToProductDb(name, quantity);
        res.render('interface/added',{
            name,
            quantity
        })
        return;
    }

    res.render('error',{
        message:`Brak produktu o nazwie ${name}`,
        link:"/interface",
        txt:"Powrót do interfejsu"
    })

}).delete('/:name',async(req,res)=>{
    const name = req.params.name;
    if(await salesProduct.checkName(name)){
        await productDb.delete(name);
        res.render('interface/deleted',{
            name
        })
        return;
    }
    res.render('error',{
        message:`Brak produktu o nazwie ${name}`,
        link:"/interface",
        txt:"Powrót do interfejsu"
    })
})

module.exports = {
    interfaceRouter,
}