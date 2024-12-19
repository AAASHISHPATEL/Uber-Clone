const { validationResult } = require('express-validator');
const userModel=require('../models/user_model');
const userService=require("../services/userService");
const blacklistedTokenModel = require('../models/blacklistedToken_model');



module.exports.registerUser=async (req,res,next) => {
    const errors=validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const {fullname,email,password}=req.body;

    const isUserAlreadyExist =await userModel.findOne({ email });
    if (isUserAlreadyExist) {
      return res
        .status(400)
        .json({ message: "User already exist with this email." });
    }

    const hashedPassword=await userModel.hashPassword(password);

    const user=await userService.createUser({fullname,email,password:hashedPassword});

    const token = user.generateAuthToken();
    res.status(201).json({token,user});
    // console.log(user);

}

module.exports.loginUser=async (req,res,next)=>{
    const errors=validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const {email,password}=req.body;
    // const hashedPassword=await userModel.hashPassword(password);
    const user=await userModel.findOne({email}).select('+password');
    if(!user){
        return res.status(401).json({message:"Invalid email or password!"});
    }

    const isPasswordMatch = await user.comparePassword(password);
    if(!isPasswordMatch){
        return res.status(401).json({message:"Invalid email or password!"});
    }

    const token= await user.generateAuthToken();
    res.cookie('token',token,{
        httpOnly:true,
        maxAge:3600000
    })

    return res.status(200).json({token,user});
}

module.exports.getUserProfile = async (req, res, next) => {
    return res.status(200).json(req.user);
}

module.exports.logoutUser = async (req,res,next)=>{
    res.clearCookie('token');
    const token=req.cookies.token || req.headers.authorization?.split(' ')[1];
    await blacklistedTokenModel.create({token});


   return res.status(200).json({message:"Logged Out"});
}

   