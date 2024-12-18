const userModel=require('../models/user_model');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const blacklistedTokenModel = require('../models/blacklistedToken_model');

module.exports.authUser=async (req,res,next)=>{
    const token=req.cookies.token || req.headers.authorization?.split(' ')[1];
    if(!token){
      return  res.status(401).json({message:"unauthorized"});
    }

    const isBlacklisted= await userModel.findOne({token:token});
    if(isBlacklisted){
      return res.status(401).json({message:"unauthorized"});
    }

    try {

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user=await userModel.findById(decodedToken._id);

        req.user=user;
        return next(); 

    } catch (error) {
      return  res.status(401).json({message:"unauthorized"});
    }
}