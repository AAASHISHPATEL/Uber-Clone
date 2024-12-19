const blacklistedTokenModel = require('../models/blacklistedToken_model');
const captainModel=require('../models/Captain_model');
const captainSevices=require("../services/captainServices");
const {validationResult}=require('express-validator');


module.exports.registerCaptain = async (req, res, next) => {

    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const {fullname,email,password,vehicle}=req.body;

    const isCaptainAlreadyExist=await captainModel.findOne({email});
    if(isCaptainAlreadyExist){
      return  res.status(400).json({message:"Captain already exist with this email."});
    }

    const hashedPassword= await captainModel.hashPassword(password);

    const captain = await captainSevices.createCaptain({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email:email,
      password: hashedPassword,
      colour: vehicle.colour,
      plate: vehicle.plate,
      capacity: vehicle.capacity,
      vehicleType: vehicle.vehicleType,
    });

    const token = await captain.generateAuthToken();

    res.status(201).json({token,captain});
};

module.exports.loginCaptain= async(req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const {email,password}=req.body;

    const captain=await captainModel.findOne({email}).select('+password');
    if(!captain){
        return res.status(401).json({message:"Invalid email or password!"});
    }

    const isPasswordMatch = await captain.comparePassword(password);
    if(!isPasswordMatch){
        return res.status(401).json({message:"Invalid password or email."});
    }

    const token=await captain.generateAuthToken();

    res.cookie('token',token);
    res.status(200).json({token,captain});
}

module.exports.getCaptainProfile = async (req, res, next) => {
    return res.status(200).json(req.captain);
};

module.exports.logoutCaptain=async (req,res,next) => {
    res.clearCookie("token");
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    await blacklistedTokenModel.create({ token });

    return res.status(200).json({ message: "Logged Out" });
}