const express=require('express');
const {basket} = require('../dbs/basketDB.js');
const {validate} = require('email-validator');
const {orders} = require('../dbs/ordersDb.js');
const {checkAndChangeLogged} = require('../utils/helpFunctions.js');
const {v4} = require('uuid');

const summaryRouter=express.Router();

summaryRouter.get('/',async (req,res)=>{
    await checkAndChangeLogged();
    const data=await basket.load();
    const arrOfProductsStrings=data.map(obj=>{
        return `${obj.name} w ilości ${obj.amount} g i cenie ${obj.price} zł`;
    });
    const sumOfPrices= await basket.sumAll();
    res.render('summary/summary',{
        strings:arrOfProductsStrings,
        price:sumOfPrices,
    });
}).post('/',async (req,res)=>{
    const { name, secondName, city, street, postId, email, phone }=req.body;
    const ifEmailGood= await validate(email);
    if(name.length<2){
        res.render('error',{
            message:"Błędne imię",
            link:"/summary",
            txt:"Powrót do składania zamówienia"
        })
        return;
    }
    if(secondName.length<2){
        res.render('error',{
            message:"Błędne nazwisko",
            link:"/summary",
            txt:"Powrót do składania zamówienia"
        })
        return;
    }
    if(street.length<=1){
        res.render('error',{
            message:"Błędny adres",
            link:"/summary",
            txt:"Powrót do składania zamówienia"
        })
        return;
    }
    if(city.length<2){
        res.render('error',{
            message:"Błędne miasto",
            link:"/summary",
            txt:"Powrót do składania zamówienia"
        })
        return;
    }
    if(postId.length<3){
        res.render('error',{
            message:"Błędny kod pocztowy",
            link:"/summary",
            txt:"Powrót do składania zamówienia"
        })
        return;
    }
    if(phone.length<9||typeof Number(phone) !='number'){
        res.render('error',{
            message:"Błędny numer telefonu",
            link:"/summary",
            txt:"Powrót do składania zamówienia"
        })
        return;
    }
    if(!ifEmailGood){
        res.render('error',{
            message:"Błędny adres email",
            link:"/summary",
            txt:"Powrót do składania zamówienia"
        })
        return;
    }

    const sum=await basket.sumAll();
    const products=await basket.load();
    const id=v4();
    await orders.createOrder(name,secondName,city,street,postId,email,phone,id,sum,products);
    await basket.clearBasket();

    res.render('order/orderDone',{
        id,
        link:'/home',
        txt:"Powrót do sklepu"
    });
})

module.exports = {
    summaryRouter,
}