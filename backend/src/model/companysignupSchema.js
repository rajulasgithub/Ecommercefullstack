const mongoose= require("mongoose");
const companysignupSchema=new mongoose.Schema({
    loginId:{type:mongoose.Types.ObjectId,ref:"login"},
    image:{type:String,required:true},
    companyName:{type:String,required:true},
    state:{type:String,required:true},
    district:{type:String,required:true},
    pincode:{type:Number,required:true},
    contactNumber:{type:Number,required:true},
    regNumber:{type:Number,required:true},
    gstNumber:{type:Number,required:true},
})

const companysignupDB= new mongoose.model('companylist',companysignupSchema);
module.exports=companysignupDB;