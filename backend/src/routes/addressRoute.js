const express=require("express");
const addressDB = require("../model/addressSchema");
const checkauth = require("../middleware/checkauth");
const productDB = require("../model/addproductsSchema");
const  addressRoute= express.Router();

addressRoute.post('/addAddress',checkauth,async(req,res)=>{
    try{
        const data={
    loginId:req.userData.loginId,
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
        message:"address added",
    }) 
}
else{
    return res.status(400).json({
        success:false,
        error:true,
        message:"address not added",
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

// addressRoute.get('/carttotal',async(req,res)=>{
//     try{
//    const cart= await cartdb.find();
//    const product=await productDB.find();


//     catch(error){
//         return res.status(500).json({
//             success:false,
//             error:true,
//             errorMessage:error.message,
//             message:"something went wrong",
//         })
//     }
// })

addressRoute.get('/getaddress',checkauth,async(req,res)=>{
    try{
      const data= await addressDB.findOne({loginId:req.userData.loginId})
      if(data){
        return  res.status(200).json({
            success:true,
            error:false,
            data:data,
            message:"address found",
        }) 
      }
    
    else{
        return res.status(400).json({
            success:false,
            error:true,
            message:"address not found",
        })
    }}
    catch(error){
        return res.status(500).json({
                        success:false,
                        error:true,
                        errorMessage:error.message,
                        message:"something went wrong",
         })
    
}})


addressRoute.put('/updateaddress',checkauth,async(req,res)=>{
    try{
       const oldData= await addressDB.findOne({loginId:req.userData.loginId})
       const data={
        address:req.body.address,
        state:req.body.state,
        district:req.body.district,
        pincode:req.body.pincode,
        BuildingNumber:req.body.BuildingNumber,
       }
       const result=await addressDB.updateOne({loginId:req.userData.loginId},{$set:data})
       if(result){
        return  res.status(200).json({
            success:true,
            error:false,
            data:result,
            message:"address updated",
        }) 
    }
    else{
        return res.status(400).json({
            success:false,
            error:true,
            message:"address not updated",
        })
    }
    }
    catch(error){
        return res.status(500).json({
                        success:false,
                        error:true,
                        errorMessage:error.message,
                        message:"something went wrong",
         })}
})


module.exports=addressRoute;
