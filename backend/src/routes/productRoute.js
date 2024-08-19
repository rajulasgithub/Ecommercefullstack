const express= require("express");
const productDB = require("../model/addproductsSchema");
const productRoute=express.Router();
const multer = require('multer');
const cloudinary=require('cloudinary').v2;
const {CloudinaryStorage}=require('multer-storage-cloudinary');
const cartDB = require("../model/cartSchema");
const checkauth = require("../middleware/checkauth");
require('dotenv').config();
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_KEY,
    api_secret:process.env.CLOUD_SECKEY,
});

const storageImage=new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:'ecommerceapp',
    },
});
const uploadImage=multer({storage:storageImage});
// const storage= multer.diskStorage({
//     destination:function(req,file,cb){
//         cb(null,'../ecommerceapp/public/uploads')
//     },
//     filename:function(req,file,cb){
//         cb(null,file.originalname)
//     },

// });

// const upload= multer({storage});





productRoute.post('/addproduct', uploadImage.array('image',1),async(req,res)=>{
    console.log(req.body);
    
    try{
    const data={
        prdName:req.body.prdName,
        image: req.files?req.files.map((file)=>file.path):null,
        prize:req.body.prize,
        size:req.body.size,
        material:req.body.material,
    }
    console.log(data);
    
    const result= await productDB(data).save();
    if(result){
        
            return  res.status(200).json({
                success:true,
                error:false,
                data:result,
                message:"successfully Added product",
            }) 
        }
        else{
            return res.status(400).json({
                success:false,
                error:true,
                message:"not added",
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


productRoute.get('/viewproduct',async(req,res)=>{
    try{
    const result= await productDB.find();
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

productRoute.get('/viewone/:id',async(req,res)=>{
    try{
    const result= await productDB.findOne({_id:req.params.id});
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


productRoute.put('/deleteproduct',async(req,res)=>{
    try{
    const result= await productDB.delete({_id:req.params.id})
    if(result){
        return  res.status(200).json({
            success:true,
            error:false,
            data:result,
            message:"successfully deleted product",
        }) 
    }
    else{
        return res.status(400).json({
            success:false,
            error:true,
            message:"not deleted",
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


productRoute.put('/updateproduct/:id',uploadImage.array("image"),async(req,res)=>{
    try{
    const oldData= await productDB.findOne({_id:req.params.id});
    const data={
        prdName:req.body.prdName? req.body.prdName: oldData.prdName,
        image:req.files? req.files.map((file)=>file.path):oldData.image,
        prize:req.body.prize? req.body.prize: oldData.prize,
        size:req.body.size? req.body.size: oldData.size,
        material:req.body.material? req.body.material: oldData.material,
    }
    const result = await productDB.updateOne({_id:req.params.id},{$set:data})
    if(result){
        return  res.status(200).json({
            success:true,
            error:false,
            data:result,
            message:"successfully updated product",
        }) 
    }
    else{
        return res.status(400).json({
            success:false,
            error:true,
            message:"not updated",
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

//add to cart

productRoute.post('/addtocart',checkauth,async(req,res)=>{
    console.log(req.body)
    try{
      const data={
        loginId:req.userData.loginId,
        prdId:req.body.productId,
        quantity:1,
        // status:
      }
      const result= await cartDB(data).save();
      if(result){
        return  res.status(200).json({
            success:true,
            error:false,
            data:result,
            message:"successfully added to cart",
        }) 
    }
    else{
        return res.status(400).json({
            success:false,
            error:true,
            message:"not added to cart",
        })
    }
    }
    catch(error){
      return res.status(500).json({
        success:false,
        error:true,
        errorMessage:error.message,
        message:"something went wrong"
      })
    }
})

productRoute.get('/viewcart',checkauth,async(req,res)=>{
    try{
        const result= await cartDB.find({loginId:req.userData.loginId}).populate('prdId')
        if(result){
            return  res.status(200).json({
                success:true,
                error:false,
                data:result,
                message:"successfully viewed ",
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


module.exports=productRoute;
