const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose=require('mongoose');

const captainModelSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, "First name must contain atleast 3 characters"],
    },
    lastname: {
      type: String,
      minlength: [2, "Last name must contain atleast 2 characters"],
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/.+\@.+\..+/, "Please enter a valid email address"],
    minlength: [5, "Email must contain atleast 5 characters"],
  },
  password: {
    type: String,
    required: true,
    minlength:[6,"Password must contain atleast 6 character"],
    select: false,
  }, 
  socketId:{
    type:String,
  },
  status:{
    type:String,
    enum:['active','inactive'],
    default:'inactive',
  },
  vehicle:{
    colour:{
        type:String,
        required:true,
        minlength:[3,"Colour must be of length 3 charecter."],
    },
    plate:{
        type:String,
        required:true,
        minlength:[1,"Plate no should contain atleast 1 charecter."],
    },
    capacity:{
        type:Number,
        required:true,
        min:[1,"Capacity must be atleast 1"],
    },
    vehicleType:{
        type:String,
        required:true,
        enum:['car','motercycle','auto'],
    }
  },
  location:{
    lat:{
        type:Number,
    },
    lng:{
        type:Number,
    }
  }
});

captainModelSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    ///{ _id: this._id }  ======payload
    expiresIn: "24h", // expire after 24 hours
  });
  return token;
};

captainModelSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

captainModelSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

const captainModel=mongoose.model('captain',captainModelSchema);
module.exports=captainModel;