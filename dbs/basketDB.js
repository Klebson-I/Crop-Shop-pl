const {writeFile,readFile} = require('fs').promises;
const {join} = require('path');

class Basket{
    constructor() {
        this.path=join(__dirname,'../','data/basket.json')
    }
    async addProduct(name,price,amount){
        const data=await this.load();
        data.push({
            name,
            price,
            amount
        })
        await this.update(data);
    }
    async load(){
        return JSON.parse(await readFile(this.path,'utf-8'));
    }
    async update(data){
        await writeFile(this.path,JSON.stringify(data),'utf8');
    }
    async findOneProduct(name,req){
        const data=await this.load();
        const obj=data.filter(obj=>{
            if(req.params.name===obj.name)return obj;
        })
        console.log("Basket DB (obj,obj[0] : "+obj,obj[0]);
        return obj[0];
    }
    async remove (name) {
        const data=await this.load();
        const newData=data.filter(obj=>obj.name!==name);
        await this.update(newData);
    }
    async sumAll(){
        const data=await this.load();
        const prices=data.map(obj=>Number(obj.price));
        return prices.reduce((a,b)=>a+b).toFixed(2);
    }
    async clearBasket(){
        const emptyArr=[];
        await this.update(emptyArr);
    }
}
const basket=new Basket();

module.exports = {
    basket
}
