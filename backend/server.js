const express = require("express");
const app= express();
const cors=require("cors");
const mongoose=require("mongoose");
const authroutes = require("./src/routes/authRoute");
const productRoute = require("./src/routes/productRoute");
const addressRoute = require("./src/routes/addressRoute");
require('dotenv').config();



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));



mongoose.connect(process.env.MONGO_URL).then((response)=>{
    console.log('Database is connected');
    console.log(process.env.MONGO_URL);
}).catch((error)=>{
    console.log(error)
    console.log('Database not connected'); 
})


app.use('/auth',authroutes)
app.use('/product',productRoute)
app.use('/address',addressRoute)

app.listen(process.env.PORT,(req,res)=>{
    console.log("server is running  on:http://localhost:8080");
})

