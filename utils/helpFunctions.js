const { productDb } =require('../dbs/allProductsDB.js')
const {basket} =require('../dbs/basketDB.js');
const {writeFile, readFile}=require('fs').promises;
const {join} = require('path');
const safeAmount=(val,amount)=>{
    console.log(val,amount);
    if(Number(val)>1000){
        return 1000;
        //add error when someone want to scam and change max of range input in HTML
    }else{
        return val;
    }
}

const getPrice=async (name,amount)=>{
    const data=await productDb.load();
    const obj=data.find(obj=>obj.name===name);
    const multiplier=(amount/100).toFixed(2);
    const newWeight=(obj.amount - (amount/1000).toFixed(3)).toFixed(3);
    const objToUpdate={
        ...obj,
        amount:newWeight,
    }
    await productDb.updateWeight(objToUpdate);
    return (obj.price*multiplier).toFixed(2);
}

const checkAmount=(data)=>{
    return data.map(obj=>{
        if(obj.amount<=0.1){
            return {
                ...obj,
                amount:false
            }
        }else{
            return obj;
        }
    })
}

const getMaxAmountForClient=(obj)=>{
    return{
        ...obj,
        maxAmount:obj.amount>1?1:obj.amount,
    }
}

const getAmountInGrams=(obj)=>{
    console.log(obj, obj.amount);
    return obj.amount*1000;
}

const giveAmountBackToDatabase=async(name,req)=>{
    const basketProduct=await basket.findOneProduct(name,req);
    const productToUpdate=await productDb.findOneProduct(name,req);
    const basketAmount=basketProduct.amount;
    const productAmount=productToUpdate.amount;
    const newAmount=Number(productAmount)+Number(basketAmount)/1000;
    const newProduct={
        ...productToUpdate,
        amount:String(newAmount)
    }
    await productDb.updateWeight(newProduct);
    await basket.remove(name);
}

const setLogged=async(val)=>{
    const path=join(__dirname,'../data/logged.json');
    const obj=JSON.parse(await readFile(path,'utf8'));
    console.log(obj);
    obj.logged=val.toString();
    await writeFile(path,JSON.stringify(obj),'utf8');
}

const checkLogged=async()=>{
    const path=join(__dirname,'../data/logged.json');
    const obj=JSON.parse(await readFile(path,'utf8'));
    return obj.logged;
}

const checkAndChangeLogged=async()=>{
    if(await checkLogged()==='true')await setLogged(false);
}


module.exports = {
    safeAmount,
    getPrice,
    checkAmount,
    getMaxAmountForClient,
    getAmountInGrams,
    giveAmountBackToDatabase,
    setLogged,
    checkLogged,
    checkAndChangeLogged
}