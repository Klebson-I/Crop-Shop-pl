const express=require('express');
const hbs=require('express-handlebars');
const methodOverride = require('method-override');
const {uploadRouter} = require("./routes/uploadFile.js");
const {basketRouter} = require("./routes/basket.js");
const {aboutUsRouter} = require("./routes/aboutUs.js");
const {productsRouter} = require("./routes/products.js");
const {homeRouter} = require("./routes/home.js");
const {summaryRouter} = require('./routes/summary.js');
const {adminLogRouter} = require('./routes/adminLog.js');
const {interfaceRouter} = require('./routes/workInterface.js');
const {removerRouter} = require('./routes/remover.js');
const {handlebarsHelpers} =require('./utils/handlebars-helpers.js');
const app=express();

app.engine('.hbs',hbs({
    extname:'.hbs',
    helpers:handlebarsHelpers,
}));
app.set('view engine', '.hbs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static('public'));



app.use('/',homeRouter);
app.use('/products',productsRouter);
app.use('/aboutUs',aboutUsRouter);
app.use('/basket',basketRouter);
app.use('/summary',summaryRouter);
app.use('/adminLog',adminLogRouter);
app.use('/interface',interfaceRouter);
app.use('/upload',uploadRouter);
app.use('/remover',removerRouter);



app.listen(3000,()=>{
    console.log('App runing on 3000 port');
})

