const jwt=require('jsonwebtoken');
module.exports=(req,res,next)=>{
  try{
    console.log(req.headers.authorization.split(' ')[1]);
    const token=req.headers.authorization.split(' ')[1];  
    const decodeToken=jwt.verify(token,"encryptkey")
    req.userData={
        loginId:decodeToken.loginId,
        role:decodeToken.role,
    }
    next();
  }
  catch(error){
    return  res.status(400),json({
        success:false,
        error:true,
        message:"auth failed",
    }) 
  }

}
