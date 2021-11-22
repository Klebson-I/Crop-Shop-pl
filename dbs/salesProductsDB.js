const {writeFile,readFile} = require('fs').promises;
const {join} = require('path');
const {productDb} =require('./allProductsDB.js');

class SalesProduct{
    constructor() {
        this.path=join(__dirname,'../data/allProductsInSales.json');
    }
    async load(){
        return JSON.parse(await readFile(this.path,'utf-8'));
    }
    async update(data){
        await writeFile(this.path,JSON.stringify(data),'utf8');
    }
    async findOne(name){
        const data=await this.load();
        const obj=data.find(obj=>obj.name===name);
        console.log(obj);
        return obj;
    }
    async checkName(name){
        const data=await this.load();
        const names=data.map(obj=>obj.name);
        if(names.includes(name)){
            return true;
        }
        else{
            return false;
        }
    }
    async addProductToProductDb(name,quantity){
        const product=await this.findOne(name);
        const data=await productDb.load();
        if(data.map(obj=>obj.name).includes(name)){
            if(Number(data.find(obj=>obj.name===name).amount)>0){
                const amount=(Number(data.find(obj=>obj.name===name).amount)+Number((Number(quantity)/1000).toFixed(2))).toString();
                const newObject={
                    name,
                    img:product.img,
                    price:product.price,
                    amount
                }
                await productDb.updateWeight(newObject);
            }else{
                const newObject={
                    name,
                    img:product.img,
                    price:product.price,
                    amount:((Number(quantity)/1000).toFixed(2)).toString()
                }
                await productDb.updateWeight(newObject);
            }
        }else
        {
            const newObject={
                name,
                img:product.img,
                price:product.price,
                amount:((Number(quantity)/1000).toFixed(2)).toString()
            }
            data.push(newObject);
            await productDb.upload(data);
        }

    }
    async add(obj){
        const data=await this.load();
        data.push(obj);
        await this.update(data);
    }

    async remove(name){
        const data=await this.load();
        const newData=data.filter(obj=>obj.name!==name);
        await this.update(newData);
    }
    async getNamesOfProducts(){
        const salesProducts=await this.load();
        return salesProducts.map(obj=>obj.name);
    }
}

const salesProduct=new SalesProduct();

module.exports={
    salesProduct,
}