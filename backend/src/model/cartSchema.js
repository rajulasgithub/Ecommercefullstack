const mongoose= require("mongoose");
const cartSchema = new mongoose.Schema({
    loginId:{type:mongoose.Types.ObjectId,ref:'login'},
    prdId:{type:mongoose.Types.ObjectId,ref:'productlist'},
    quantity:{type:Number,required:true},
    status:{type:Number,required:true},
})

const cartDB= new mongoose.model('cartlist',cartSchema);
module.exports=cartDB;