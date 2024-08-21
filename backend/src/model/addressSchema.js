const mongoose= require("mongoose")
addressSchema=new mongoose.Schema({
    loginId:{type:mongoose.Types.ObjectId,ref:'login'},
    address:{type:String,required:true},
    state:{type:String,required:true},
    district:{type:String,required:true},
    pincode:{type:Number,required:true},
    BuildingNumber:{type:Number,required:true},
})
const addressDB= new mongoose.model('addresslist',addressSchema)
module.exports=addressDB;