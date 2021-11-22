const express=require('express');
const {safeAmount, getPrice, checkAmount, getMaxAmountForClient, getAmountInGrams, checkAndChangeLogged} = require("../utils/helpFunctions.js");
const {productDb} = require('../dbs/allProductsDB.js');
const {basket} = require('../dbs/basketDB.js');
const productsRouter=express.Router();


productsRouter
    .get('/',async (req,res)=>{
        await checkAndChangeLogged();
        const data=await productDb.load();
        const checkedData=checkAmount(data);
        res.render('products/products',{
            products:checkedData,
        });
    })
    .get('/:name',async (req,res)=>{
        await checkAndChangeLogged();
        const name=req.params.name;
        //zabezpieczyć podawanie innego produktu przez URL
        if(!await productDb.checkIfUrlValid(name)){
            res.render('error',{
                message:`Nie znaleziono produktu o nazwie ${name}`,
                link:"/products",
                txt:"Powrót do oferty",
            })
            return;
        }
        const obj=await productDb.findOneProduct(name,req);
        const finalObj=getMaxAmountForClient(obj);
        res.render('products/singleProduct',{
            product:finalObj,
        })
    })
    .post('/:name',async (req,res)=>{
        const name=req.params.name;
        if(!await productDb.checkIfUrlValid(name)){
            res.render('error',{
                message:`Nie znaleziono produktu o nazwie ${name}`,
                link:"/products",
                txt:"Powrót do oferty",
            })
            return;
        }

        if(req.body.weightInput==0){
            console.log('name in product.js '+name);
            const nameWithoutSpace=name.replaceAll(" ","%20");
            res.render('error',{
                message:`Nie wybrałeś ilości produktu, wybierz produkt raz jeszcze`,
                link:`/products/${nameWithoutSpace}`,
                txt:"Powrót do produktu",
            })
            return;
        }

        const namesInBasket=await basket.load();
        const namesInBasket2=namesInBasket.map(obj=>obj.name);

        if(namesInBasket2.includes(name)){
            res.render('error',{
                message:`Już wybrałeś produkt o nazwie ${name}, sprawdź koszyk`,
                link:"/basket",
                txt:"Do koszyka",
            })
            return;
        }

        const obj=await productDb.findOneProduct(name,req);
        const objAmount=getAmountInGrams(obj);
        const amount=safeAmount(req.body.weightInput,objAmount);
        console.log(amount);
        const price= await getPrice(name,amount);
        await basket.addProduct(name,price,amount);
        res.redirect('/basket');
    })




module.exports = {
    productsRouter,
}