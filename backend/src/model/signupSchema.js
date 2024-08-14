const mongoose= require("mongoose");
const signupSchema=new mongoose.Schema({
    loginId:{type:mongoose.Types.ObjectId,ref:"login"},
    firstname:{type:String,required:true},
    // lastname:{type:String,reqired:true},
    number:{type:Number,required:true},
    // dateofbirth:{type:Number,required:true},
    gender:{type:String,required:true},
    state:{type:String,requiredd:true},
    district:{type:String,requiredd:true}, 
    pincode:{type:Number,requiredd:true},
    place:{type:String,requiredd:true},
    
})

const signupDB= new mongoose.model('registration',signupSchema);
module.exports=signupDB;
