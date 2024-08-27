const express=require("express");
const addressDB = require("../model/addressSchema");
const checkauth = require("../middleware/checkauth");
const productDB = require("../model/addproductsSchema");
const signupDB = require("../model/signupSchema");
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


addressRoute.put('/changedeliveryaddress',checkauth,async(req,res)=>{
    try{
      const signup=await signupDB.find({loginId:req.userData.loginId});
      const address=await addressDB.find({loginId:req.userData.loginId});
      const signupdata={
        firstname:req.body.firstname?req.body.firstname:signup.firstname,
        number:req.body.number?req.body.number:signup.number,
      }
      const addressdata={
        address:req.body.address?req.body.address:address.address,
        state:req.body.state?req.body.state:address.state,
        district:req.body.district?req.body.district:address.district,
        pincode:req.body.pincode?req.body.pincode:address.pincode,
        BuildingNumber:req.body.BuildingNumber?req.body.BuildingNumber:address.BuildingNumber,
      }
      const resulttwo=await addressDB.updateOne({loginId:req.userData.loginId},{$set:addressdata})

      const resultone=await signupDB.updateOne({loginId:req.userData.loginId},{$set:signupdata})
      if(resultone&&resulttwo){
        return  res.status(200).json({
            success:true,
            error:false,
            data:resultone,
            data:resulttwo,
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
})
    }
})

module.exports=addressRoute;
