const express=require('express');
const multer=require('multer');
const {extname,join} = require('path');
const {rm} = require('fs').promises;
const {salesProduct} = require('../dbs/salesProductsDB.js');
const {checkLogged} = require('../utils/helpFunctions.js');
const uploadRouter=express.Router();

const fileStorageEngine=multer.diskStorage({
    destination: (req,res,cb)=>{
        cb(null,'./public/images/products')
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})


const upload=multer({storage:fileStorageEngine});


uploadRouter
    .get('/',async (req,res)=>{
        if(await checkLogged()=="true"){
            res.render('uploads/upload');
        }
        else{
            res.render('error',{
                message:"Nie masz dostępu do tych zasobów",
                link: '/',
                txt :'Powrót do strony głównej'
            })
        }
    })
    .post('/',upload.single('file'),async(req,res)=>{

        const {originalname,destination}=req.file;
        const {name,price}=req.body;
        let wasImgUploaded=false;

        if(!originalname||!destination){
            res.render('error',{
                message:"Zdjęcie nie zostało dodane",
                link:"/upload",
                txt:"Do formularza dodawania produktu"
            })
            return;
        }

        const path=join(__dirname,'../',destination,originalname);

        if(extname(path)!=='.jpg'&&extname(path)!=='.png'){
            console.log(path);
            console.log('invalid');
            await rm(path);
            res.render('error',{
                message:"Złe rozszerzenie pliku",
                link:"/upload",
                txt:"Do formularza dodawania produktu"
            })
            return;
        }
        else {
            wasImgUploaded=true;
        }

        if(name.length!==0 &&Number(price)>0&&name&&price){
            const obj= {
                name,
                price,
                img: `/images/products/${originalname}`,
            }
            await salesProduct.add(obj);
        }
        else if(wasImgUploaded){
            await rm(path);
            res.render('error',{
                message:"Błędnie wypełniony formularz, któreś z pól musiało być puste",
                link:'/upload',
                txt:"Do formularza dodawania produktu"
            })
        }
        res.render('uploads/uploaded',{
            name
        })
    })

module.exports={
    uploadRouter,
}