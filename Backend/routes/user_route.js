const express=require('express');
const router= express.Router();
const {body} =require('express-validator');
const userController=require('../controllers/userController');
const authMiddleware = require("../middlewares/auth_middleware");

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid email!"),
    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("First name must be atleast 3 charecter long."),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be atleast 6 charecter long."),
  ],
  userController.registerUser
);

router.post('/login',[
  body('email').isEmail().withMessage("Invalid Email!"),
  body('password').isLength({min:6}).withMessage("Password must be of atleast 6 charecters.")
],userController.loginUser);

router.get('/profile',authMiddleware.authUser,userController.getUserProfile);


router.get('/logout',authMiddleware.authUser,userController.logoutUser);



module.exports=router;