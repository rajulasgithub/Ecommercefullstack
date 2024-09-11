const express= require("express");
const loginDB = require("../model/loginSchema");
const signupDB = require("../model/signupSchema");
const companysignupDB = require("../model/companysignupSchema");
const authroutes= express.Router();
const jwt=require('jsonwebtoken');
const multer = require("multer");
const checkauth = require("../middleware/checkauth");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // cb(null,'.../../public/images/')
      cb(null, "../ecommerceapp/public/companylogo");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });

  const upload = multer({ storage });




//usersignup

authroutes.post('/signup',async(req,res)=>{
    console.log("body is",req.body);
    try{
        const login={
            email:req.body.email,
            password:req.body.password,
            role:2,
        }
        
        const loginresult = await loginDB(login).save();
        console.log("result is",loginresult);
        
        const signup={
            loginId:loginresult._id,
            firstname:req.body.firstname,
            // lastname:req.body.lastname,
            number:req.body.number,
            // dateofbirth:req.body.dateofbirth,
            gender:req.body.gender,
            state:req.body.state,
            district:req.body.district,
            pincode:req.body.pincode,
            place:req.body.place,   
            
            
        }
        
        const signupresult= await signupDB(signup).save();
        if(signupresult){
            return   res.status(200).json({
                success:true,
                error:false,
                data:signupresult,
                message:"successfully registered",
            })
        return res.status(400).json({
                success:false,
                error:true,
                message:"not registered",
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





authroutes.get('/view',async(req,res)=>{
    try{
        const result=await signupDB.find();
        if(result){
          return  res.status(200).json({
                success:true,
                error:false,
                data:result,
                message:"successfully viewed",
            })
           return res.status(400).json({
                success:false,
                error:true,
                message:"not viewed",
            })
        }
    
    }
    catch(error){
        res.status(500).json({
            success:false,
            error:true,
            errorMessage:error.message,
            message:"something went wrong",
        })

    }
})


authroutes.get('/viewone',checkauth, async(req,res)=>{
    try{
        console.log(req.userData);
        
        const result=await signupDB.findOne({loginId:req.userData.loginId});
        console.log(result);

        if(result){
          return  res.status(200).json({
                success:true,
                error:false,
                data:result,
                message:"successfully viewed",
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
        return   res.status(500).json({
            success:false,
            error:true,
            errorMessage:error.message,
            message:"something went wrong",
        })

    }
})


authroutes.get('/delete/:id',async(req,res)=>{
    console.log
    try{
        const result=await signupDB.deleteOne({_id:req.params.id});
        if(result){
            return  res.status(200).json({
                success:true,
                error:false,
                data:result,
                message:"deleted one",
            })
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


authroutes.put('/update/:id',async(req,res)=>{
    try{
        const olddata= await signupDB.findOne({_id:req.params.id})
        const data={
            firstname:req.body.firstname?req.body.firstname:olddata.firstname,
            lastname:req.body.lastname?req.body.lastname:olddata.lastname,
            number:req.body.number?req.body.number:olddata.number,
            dateofbirth:req.body.dateofbirth?req.body.dateofbirth:olddata.dateofbirth,
            gender:req.body.gender?req.body.gender:olddata.gender,
            state:req.body.state?req.body.state:olddata.state,
            district:req.body.district?req.body.district:olddata.district,
            pincode:req.body.pincode?req.body.pincode:olddata.pincode,
            place:req.body.place?req.body.place:olddata.place,

        }
        const result=await signupDB.updateOne({_id:req.params.id},{ $set: data })
        if(result){
            return res.status(200).json({
                success:true,
                error:false,
                data:result,
                message:"deleted one",
            })
            return  res.status(400).json({
                success:false,
                error:true,
                message:"not deleted",
            })
        }
        
    }
    catch(error){
        return  res.status(500).json({
            success:false,
            error:true,
            errorMessage:error.message,
            message:"something went wrong",
        })

    }
})


authroutes.post('/login',async(req,res)=>{
    // console.log("data is",req.body);

    try{

        const email=req.body.email;
        const password=req.body.password;
        if(!email || !password){
            return res.status(400).json({
                success:false,
                error:true,
                message:"All fields are required", 
            })
        }else{
        const result=await loginDB.findOne({email:req.body.email});
        if(!result){
            return res.status(400).json({
                success:false,
                error:true,
                message:"email does not exist",
            })
        }else{
            if(result.password==password){

                const token=jwt.sign(
                    {
                    loginId:result._id,
                    role:result.role,
                    },
                    "encryptkey",
                    {expiresIn:'1h'}
                )
                return res.status(200).json({
                    success:true,
                    error:false,
                    message:"successfully login",
                    loginId:result._id,
                    role:result.role,
                    token:token,
                })
            }
            else{
              return  res.status(400),json({
                    success:false,
                    error:true,
                    message:"not logged in",
                })
            }

        }
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


//companysignup

authroutes.post('/companysignup',upload.single("image"),async(req,res)=>{
    console.log(req.body)
    try{
        const logindata={
            email:req.body.email,
            password:req.body.password,
            role:3,
        }
        const loginresult= await loginDB(logindata).save();

        const data={
            loginId:loginresult._id,
            image:req.file.filename,
            companyName:req.body.companyName,
            state:req.body.state,
            district:req.body.district,
            pincode:req.body.pincode,
            contactNumber:req.body.contactNumber,
            regNumber:req.body.regNumber,
            gstNumber:req.body.gstNumber,
        }
        const result= await companysignupDB(data).save();
        // console.log(result.image);

        if(result){
            return  res.status(200).json({
                success:true,
                error:false,
                data:result,
                message:"successfully registered",
            }) 
        }
        else{
            return res.status(400).json({
                success:false,
                error:true,
                message:"not registered",
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



authroutes.get('/viewcompany',async(req,res)=>{
    try{
        const result=await companysignupDB.find();
        if(result){
          return  res.status(200).json({
                success:true,
                error:false,
                data:result,
                message:"successfully viewed",
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
        res.status(500).json({
            success:false,
            error:true,
            errorMessage:error.message,
            message:"something went wrong",
        })

    }
})


authroutes.get('/viewonecompany/:id',async(req,res)=>{
    try{
        const result=await companysignupDB.findOne({_id:req.params.id});
        if(result){
          return  res.status(200).json({
                success:true,
                error:false,
                data:result,
                message:"successfully viewed",
            })
            return res.status(400).json({
                success:false,
                error:true,
                message:"not viewed",
            })
        }
    
    }
    catch(error){
        return   res.status(500).json({
            success:false,
            error:true,
            errorMessage:error.message,
            message:"something went wrong",
        })

    }
})


authroutes.get('/deletecompany/:id',async(req,res)=>{
    console.log
    try{
        const result=await companysignupDB.deleteOne({_id:req.params.id});
        if(result){
            return  res.status(200).json({
                success:true,
                error:false,
                data:result,
                message:"deleted one",
            })
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



authroutes.put('/updatecompany/:id',async(req,res)=>{
    console.log(req.body);
    console.log(req.params);

    try{
        const olddata= await companysignupDB.findOne({_id:req.params.id})
        console.log(olddata)
        const data={
            // companylogo:req.file?req.file.companylogo:olddata.companylogo,
            companyName:req.body.companyName?req.body.companyName:olddata.companyName,
            state:req.body.state?req.body.state:olddata.state,
            district:req.body.district?req.body.district:olddata.district,
            pincode:req.body.pincode?req.body.pincode:olddata.pincode,
            contactNumber:req.body.contactNumber?req.body.contactNumber:olddata.contactNumber,
            regNumber:req.body.regNumber?req.body.regNumber:olddata.regNumber,
            gstNumber:req.body.gstNumber?req.body.gstNumber:olddata.gstNumber,

        }
        console.log("new data",data)
        const result=await companysignupDB.updateOne({_id:req.params.id},{ $set: data })
        console.log(result.companyName);
        if(result){
            return res.status(200).json({
                success:true,
                error:false,
                data:result,
                message:"updated one",
            })
            return  res.status(400).json({
                success:false,
                error:true,
                message:"not updated",
            })
        }
        
    }
    catch(error){
        return  res.status(500).json({
            success:false,
            error:true,
            errorMessage:error.message,
            message:"something went wrong",
        })

    }
})







module.exports=authroutes;




