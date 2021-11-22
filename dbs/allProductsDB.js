const {writeFile,readFile} = require('fs').promises;
const {join} = require('path');

class ProductsDB{
    constructor() {
        this.path=join(__dirname,'../','data/products.json');
    }
    async load(){
        return JSON.parse(await readFile(this.path,'utf8'));
    }
    async upload(data){
        await writeFile(this.path,JSON.stringify(data),'utf8');
    }
    async delete(name){
        const data=await this.load();
        const newData=data.filter((obj)=>{
            if(obj.name!==name){
                return obj;
            }
        })
        await this.upload(newData);
    }
    async updateWeight(obj){
        const data=await this.load();
        const newData=data.map(object=>{
            if(object.name===obj.name){
                return {
                    ...object,
                    ...obj
                }
            }else{
                return object;
            }
        })
        await this.upload(newData);
    }
    async findOneProduct(name,req){
        const data=await productDb.load();
        const obj=data.filter(obj=>{
            if(req.params.name===obj.name)return obj;
        })
        console.log("products DB (obj,obj[0] : "+obj,obj[0]);
        return obj[0];
    }

    async checkIfUrlValid(name) {
        const data = await this.load();
        const names = data.map(element => element.name);
        const valid = names.includes(name);
        return valid;
    }
}

const productDb=new ProductsDB();

module.exports = {
    productDb,
}