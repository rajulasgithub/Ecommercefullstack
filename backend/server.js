const express = require("express");
const app= express();
const cors=require("cors");
const mongoose=require("mongoose");
const authroutes = require("./src/routes/authRoute");
const productRoute = require("./src/routes/productRoute");


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));



mongoose.connect('mongodb+srv://rajulasrazak688:5s6WcR2LfTDYepHb@cluster0.0kzd0lb.mongodb.net/ecommerceapp').then((response)=>{
    console.log('Database is connected');
}).catch((error)=>{
    console.log('Database not connected'); 
})


app.use('/auth',authroutes)
app.use('/product',productRoute)

app.get('/',(req,res)=>{
    res.send('hiiii')
})
app.listen(8080,(req,res)=>{
    console.log("server is running  on:http://localhost:8080");
})