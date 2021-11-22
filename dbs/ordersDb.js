const {join} = require('path');
const {writeFile, readFile} = require('fs').promises;


class OrdersDb{
    constructor() {
        this.path=join(__dirname,'../','data/orders.json')
    }
    async load(){
        return JSON.parse(await readFile(this.path,'utf8'));
    }
    async upload(data){
        await writeFile(this.path,JSON.stringify(data),'utf8');
    }
    async createOrder(name,secondName,city,street,postId,email,phone,id,sum,products){
        const data=await this.load();
        const newOrderObj={
            name,
            secondName,
            city,
            street,
            postId,
            email,
            phone,
            id,
            sum,
            products,
        };
        data.push(newOrderObj);
        await this.upload(data);
    }

}

const orders=new OrdersDb();

module.exports = {
    orders,
}