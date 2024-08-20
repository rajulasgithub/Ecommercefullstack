const express=require("express");
const addressDB = require("../model/addressSchema");
const  addressRoute= express.Router();

addressRoute.post('/addAddress',async(req,res)=>{
    try{
        const data={
    address:req.body.address,
    state:req.body.state,
    district:req.body.district,
    pincode:req.body.pincode,
    BuildingNumber:req.body.BuildingNumber,
        }
const result=await addressDB(data).save();
if(result){
    return  res.status(200).json({
        success:true,
        error:false,
        data:result,
        message:"successfully view product",
    }) 
}
else{
    return res.status(400).json({
        success:false,
        error:true,
        message:"not viewed",
    })
}

    }
    catch(error){
       
            return res.status(500).json({
                success:false,
                error:true,
                errorMessage:error.message,
                message:"something went wrong",
            })
        }   
    
})



module.exports=addressRoute;
