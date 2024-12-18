const express=require('express');
const router= express.Router();
const {body} =require('express-validator');
const userController=require('../controllers/userController');

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



module.exports=router;