const express = require("express");
const productDB = require("../model/addproductsSchema");
const productRoute = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cartDB = require("../model/cartSchema");
const checkauth = require("../middleware/checkauth");
require("dotenv").config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECKEY,
});

const storageImage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ecommerceapp",
  },
});
const uploadImage = multer({ storage: storageImage });
// const storage= multer.diskStorage({
//     destination:function(req,file,cb){
//         cb(null,'../ecommerceapp/public/uploads')
//     },
//     filename:function(req,file,cb){
//         cb(null,file.originalname)
//     },

// });

// const upload= multer({storage});

productRoute.post(
  "/addproduct",
  uploadImage.array("image", 1),
  async (req, res) => {
    console.log(req.body);

    try {
      const data = {
        prdName: req.body.prdName,
        image: req.files ? req.files.map((file) => file.path) : null,
        prize: req.body.prize,
        size: req.body.size,
        material: req.body.material,
        status: 0,
      };
      console.log(data);

      const result = await productDB(data).save();
      if (result) {
        return res.status(200).json({
          success: true,
          error: false,
          data: result,
          message: "successfully Added product",
        });
      } else {
        return res.status(400).json({
          success: false,
          error: true,
          message: "not added",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: true,
        errorMessage: error.message,
        message: "something went wrong",
      });
    }
  }
);

productRoute.get("/viewproduct", async (req, res) => {
  try {
    const result = await productDB.find();
    if (result) {
      return res.status(200).json({
        success: true,
        error: false,
        data: result,
        message: "successfully view product",
      });
    } else {
      return res.status(400).json({
        success: false,
        error: true,
        message: "not viewed",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "something went wrong",
    });
  }
});

productRoute.get("/viewone/:id", async (req, res) => {
  try {
    const result = await productDB.findOne({ _id: req.params.id });
    if (result) {
      return res.status(200).json({
        success: true,
        error: false,
        data: result,
        message: "successfully view product",
      });
    } else {
      return res.status(400).json({
        success: false,
        error: true,
        message: "not viewed",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "something went wrong",
    });
  }
});

productRoute.put("/deleteproduct/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const data = {
      status: 6,
    };
    const result = await cartDB.updateMany(
      { prdId: req.params.id },
      { $set: data }
    );
    const prdresult = await productDB.updateOne(
      { _id: req.params.id },
      { $set: data }
    );
    if (prdresult) {
      return res.status(200).json({
        success: true,
        error: false,
        data: prdresult,
        message: "successfully deleted product",
      });
    } else {
      return res.status(400).json({
        success: false,
        error: true,
        message: "not deleted",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "something went wrong",
    });
  }
});

productRoute.put(
  "/updateproduct/:id",
  uploadImage.array("image"),
  async (req, res) => {
    console.log(req.params.id);

    try {
      const oldData = await productDB.findOne({ _id: req.params.id });
      const data = {
        prdName: req.body.prdName ? req.body.prdName : oldData.prdName,
        image: req.files ? req.files.map((file) => file.path) : oldData.image,
        prize: req.body.prize ? req.body.prize : oldData.prize,
        size: req.body.size ? req.body.size : oldData.size,
        material: req.body.material ? req.body.material : oldData.material,
      };
      console.log(oldData);
      const result = await productDB.updateOne(
        { _id: req.params.id },
        { $set: data }
      );
      if (result) {
        return res.status(200).json({
          success: true,
          error: false,
          data: result,
          message: "successfully updated product",
        });
      } else {
        return res.status(400).json({
          success: false,
          error: true,
          message: "not updated",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: true,
        errorMessage: error.message,
        message: "something went wrong",
      });
    }
  }
);

productRoute.put("/updateproductstatus/:id/:value", async (req, res) => {
  console.log(req.params.id);
  console.log("value", req.params.value);

  try {
    const oldData = await productDB.findOne({ _id: req.params.id });
    const data = {
      status: req.params.value,
    };
    console.log(oldData);
    const result = await productDB.updateOne(
      { _id: req.params.id },
      { $set: data }
    );
    if (result) {
      return res.status(200).json({
        success: true,
        error: false,
        data: result,
        message: "successfully updated product",
      });
    } else {
      return res.status(400).json({
        success: false,
        error: true,
        message: "not updated",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "something went wrong",
    });
  }
});

//add to cart

productRoute.post("/addtocart", checkauth, async (req, res) => {
  console.log(req.body);
  // const now=new Date();
  // const day = now.getDate();
  // const month = now.getMonth() + 1;
  // const year = now.getFullYear();
  // const hours = now.getHours();
  // const minutes = now.getMinutes();
  // const seconds = now.getSeconds();
  // const date=(`${day}-${month}-${year}`);
  // console.log(hours)
  try {
    const data = {
      loginId: req.userData.loginId,
      prdId: req.body.productId,
      quantity: 1,
      status: 1,
      // date:(`${day}-${month}-${year}`),

      // time:hours+":"+minutes+":"+seconds,
      // date: new Date(),
    };
    console.log(data);

    const result = await cartDB(data).save();
    if (result) {
      return res.status(200).json({
        success: true,
        error: false,
        data: result,
        message: "successfully added to cart",
      });
    } else {
      return res.status(400).json({
        success: false,
        error: true,
        message: "not added to cart",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "something went wrong",
    });
  }
});

productRoute.get("/viewcart", checkauth, async (req, res) => {
  try {
    const result = await cartDB
      .find({ loginId: req.userData.loginId, status: 1 })
      .populate("prdId");
    if (result) {
      return res.status(200).json({
        success: true,
        error: false,
        data: result,
        message: "successfully viewed ",
      });
    } else {
      return res.status(400).json({
        success: false,
        error: true,
        message: "not viewed",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "something went wrong",
    });
  }
});

productRoute.get("/viewcartcmpny", async (req, res) => {
  try {
    const result = await cartDB.aggregate([
      {
        $lookup: {
          from: "addresslists",
          localField: "loginId",
          foreignField: "loginId",
          as: "result",
        },
      },
      {
        $lookup: {
          from: "productlists",
          localField: "prdId",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $lookup: {
          from: "registrations",
          localField: "loginId",
          foreignField: "loginId",
          as: "info",
        },
      },
      {
        $unwind: "$result",
      },
      {
        $unwind: "$product",
      },
      {
        $unwind: "$info",
      },
    //   {
    //     $match: {
    //       loginId: new mongoose.Types.ObjectId(id),
    //     },
    //   },
      {
        $group: {
          _id: "$loginId",
          firstname: {
            $first: "$info.firstname",
          },
          number: {
            $first: "$info.number",
          },
          image: {
            $first: "$product.image",
          },
          prdName: {
            $first: "$product.prdName",
          },
          prize: {
            $first: "$product.prize",
          },
          size: {
            $first: "$product.size",
          },
          quantity: {
            $first: "$quantity",
          },
          status: {
            $first: "$status",
          },
          address: {
            $first: "$result.address",
          },
          state: {
            $first: "$result.state",
          },
          district: {
            $first: "$result.district",
          },
          pincode: {
            $first: "$result.pincode",
          },
          BuildingNumber: {
            $first: "$result.BuildingNumber",
          },
        },
      },
    ]);
    if (result) {
      return res.status(200).json({
        success: true,
        error: false,
        data: result,
        message: "successfully viewed ",
      });
    } else {
      return res.status(400).json({
        success: false,
        error: true,
        message: "not viewed",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "something went wrong",
    });
  }
});

productRoute.get("/vieworderuser", checkauth, async (req, res) => {
  try {
    const result = await cartDB
      .find({ loginId: req.userData.loginId })
      .populate("prdId");
    if (result) {
      return res.status(200).json({
        success: true,
        error: false,
        data: result,
        message: "successfully viewed ",
      });
    } else {
      return res.status(400).json({
        success: false,
        error: true,
        message: "not viewed",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "something went wrong",
    });
  }
});

productRoute.put("/incrcart/:id", async (req, res) => {
  try {
    console.log(req.params.id);

    const oldData = await cartDB.findOne({ _id: req.params.id });
    console.log(oldData);

    const quantity = oldData.quantity + 1;

    const result = await cartDB.updateOne(
      { _id: req.params.id },
      { $set: { quantity: quantity } }
    );
    if (result) {
      return res.status(200).json({
        success: true,
        error: false,
        data: result,
        message: "successfully updated ",
      });
    } else {
      return res.status(400).json({
        success: false,
        error: true,
        message: "not updated",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "something went wrong",
    });
  }
});

productRoute.put("/decrcart/:id", async (req, res) => {
  try {
    console.log(req.params.id);

    const oldData = await cartDB.findOne({ _id: req.params.id });
    console.log(oldData);

    const quantity = oldData.quantity - 1;

    const result = await cartDB.updateOne(
      { _id: req.params.id },
      { $set: { quantity: quantity } }
    );
    if (result) {
      return res.status(200).json({
        success: true,
        error: false,
        data: result,
        message: "successfully updated ",
      });
    } else {
      return res.status(400).json({
        success: false,
        error: true,
        message: "not updated",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "something went wrong",
    });
  }
});

productRoute.get("/delcartitem/:id", checkauth, async (req, res) => {
  try {
    const result = await cartDB.deleteOne(
      { loginId: req.userData.loginId, status: 1 },
      { _id: req.params.id }
    );
    if (result) {
      return res.status(200).json({
        success: true,
        error: false,
        data: result,
        message: "successfully updated ",
      });
    } else {
      return res.status(400).json({
        success: false,
        error: true,
        message: "not updated",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "something went wrong",
    });
  }
});

// productRoute.get('/deletecart/:id',checkauth,async(req,res)=>{
//     try{
//         const result= await cartDB.deleteMany({loginId:req.userData.loginId},{_id:req.params.id})
//         if(result){
//             return  res.status(200).json({
//                 success:true,
//                 error:false,
//                 data:result,
//                 message:"successfully deleted ",
//             })
//         }
//         else{
//             return res.status(400).json({
//                 success:false,
//                 error:true,
//                 message:"not deleted",
//             })
//         }

//     }
//     catch(error)
//     {
//         return res.status(500).json({
//             success:false,
//             error:true,
//             errorMessage:error.message,
//             message:"something went wrong",
//         })
//     }
// })

productRoute.put("/updatecart", checkauth, async (req, res) => {
  try {
    const oldData = await cartDB.find({ loginId: req.userData.loginId });
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const data = {
      status: 2,
      date: `${day}-${month}-${year}`,
      deliveryDate: `${day + 5}-${month}-${year}`,
      payment: "Cash on Delivery",
    };
    const result = await cartDB.updateOne(
      { loginId: req.userData.loginId, status: 1 },
      { $set: data }
    );

    if (result) {
      return res.status(200).json({
        success: true,
        error: false,
        data: result,
        message: "successfully updated ",
      });
    } else {
      return res.status(400).json({
        success: false,
        error: true,
        message: "not updated",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "something went wrong",
    });
  }
});

productRoute.put("/updatedeliverydate/:id", async (req, res) => {
  console.log(req.body);
  try {
    const oldData = await cartDB.find({ _id: req.params.id });

    const data = {
      deliveryDate: req.body.date,
    };
    const result = await cartDB.updateMany(
      { _id: req.params.id },
      { $set: data }
    );

    if (result) {
      return res.status(200).json({
        success: true,
        error: false,
        data: result,
        message: "successfully updated ",
      });
    } else {
      return res.status(400).json({
        success: false,
        error: true,
        message: "not updated",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "something went wrong",
    });
  }
});

productRoute.put("/updatecartstatus/:id/:value", async (req, res) => {
  try {
    // const oldData=await cartDB.find({_id:req.params.id})
    // const val=req.params.value;

    const data = {
      status: req.params.value,
    };
    const result = await cartDB.updateOne(
      { _id: req.params.id },
      { $set: data }
    );

    if (result) {
      return res.status(200).json({
        success: true,
        error: false,
        data: result,
        message: "successfully updated ",
      });
    } else {
      return res.status(400).json({
        success: false,
        error: true,
        message: "not updated",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "something went wrong",
    });
  }
});

productRoute.put("/cancelorder/:id", async (req, res) => {
  try {
    const oldData = await cartDB.find({ _id: req.params.id });

    const data = {
      status: 3,
    };
    const result = await cartDB.updateMany(
      { _id: req.params.id },
      { $set: data }
    );

    if (result) {
      return res.status(200).json({
        success: true,
        error: false,
        data: result,
        message: "successfully cancelled ",
      });
    } else {
      return res.status(400).json({
        success: false,
        error: true,
        message: "not cancelled",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "something went wrong",
    });
  }
});

productRoute.get("/vieworder", checkauth, async (req, res) => {
  try {
    const result = await cartDB
      .find({ loginId: req.userData.loginId })
      .populate("prdId");
    if (result) {
      return res.status(200).json({
        success: true,
        error: false,
        data: result,
        message: "successfully Viewed ",
      });
    } else {
      return res.status(400).json({
        success: false,
        error: true,
        message: "not Viewed",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "something went wrong",
    });
  }
});

productRoute.put("/rejectorder/:id", async (req, res) => {
  try {
    // console.log(req.params);
    const oldData = await cartDB.find({ _id: req.params.id });
    //    console.log(oldData.status);
    const data = {
      status: 3,
    };
    const result = await cartDB.updateOne(
      { _id: req.params.id },
      { $set: data }
    );
    if (result) {
      return res.status(200).json({
        success: true,
        erorr: false,
        data: result,
        message: "successfully updated ",
      });
    } else {
      return res.status(400).json({
        success: false,
        error: true,
        Message: "not updated",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      errorMessage: error.message,
      message: "something went wrong",
    });
  }
});

module.exports = productRoute;
