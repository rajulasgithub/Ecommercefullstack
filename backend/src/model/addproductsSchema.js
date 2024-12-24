const mongoose = require("mongoose")
const addproductSchema= new mongoose.Schema({
  
    prdName:{type:String,required:true},
    image:{type:[String],required:true},
    prize:{type:Number,required:true},
    size:{type:String,required:true},
    material:{type:String,required:true},
    status:{type:Number,required:true},
})

const productDB=new mongoose.model('productlist',addproductSchema);
module.exports=productDB;
