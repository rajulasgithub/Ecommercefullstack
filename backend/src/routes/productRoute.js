const express= require("express");
const productDB = require("../model/addproductsSchema");
const productRoute=express.Router();
const multer = require('multer');
const storage= multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'../ecommerceapp/public/uploads')
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
    },

});

const upload= multer({storage});


productRoute.post('/addproduct', upload.single("image"),async(req,res)=>{
    console.log(req.body);
    
    try{
    const data={
        prdName:req.body.prdName,
        image: req.file.filename,
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


productRoute.put('/updateproduct/:id',upload.single("image"),async(req,res)=>{
    try{
    const oldData= await productDB.findOne({_id:req.params.id});
    const data={
        prdName:req.body.prdName? req.body.prdName: oldData.prdName,
        image:req.file? req.file.filename: oldData.filename,
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


module.exports=productRoute;
