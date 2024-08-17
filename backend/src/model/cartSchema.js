const mongoose= require("mongoose");
const cartSchema = new mongoose.Schema({
    userId:{type:mongoose.Types.ObjectId,ref:'login'},
    prdId:{type:mongoose.Types.ObjectId,ref:'productlist'},
    quantity:{type:Number,required:true},
    // status:{type:String,required:true},
})

const cartDB= new momgoose.model('cartlist',cartSchema);
module.exports=cartDB;