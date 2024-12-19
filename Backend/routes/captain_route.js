const express=require('express');
const router=express.Router();
const {body}=require('express-validator');
const captainController=require('../controllers/captainController');
const { authCaptain } = require('../middlewares/auth_middleware');

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid Email!"),
    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("First name must be atleast 3 charecter long."),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be atleast 6 charecter long."),
    body('vehicle.colour').isLength({min:3}).withMessage("Vehicle colour must contain atleast 3 charecter."),
    body('vehicle.plate').isLength({min:3}).withMessage("Plate no must be atleast of 1 charecter."),
    body('vehicle.capacity').isInt({min:1}).withMessage("Capacity must be alteast 1."),
    body('vehicle.vehicleType').isIn(['car','motercycle','auto']).withMessage("Invalid vehicle type!"),
  ],
  captainController.registerCaptain
);

router.post('/login',[
    body('email').isEmail().withMessage("Invalid Email!"),
    body('password').isLength({min:6}).withMessage("Password must contain atleast 6 character")
],captainController.loginCaptain);

router.get('/profile',authCaptain,captainController.getCaptainProfile);

router.get('/logout',authCaptain,captainController.logoutCaptain);

module.exports=router;
