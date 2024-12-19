const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

const userSchema = new mongoose.Schema({
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
    validate: {
      validator: function (v) {
        // At least one uppercase, one lowercase, one number, and one special character
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          v
        );
      },
      message:
        "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character",
    },
    select: false,
  },
  socketID: {
    type: String,
  },
});

userSchema.methods.generateAuthToken = function(){
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    ///{ _id: this._id }======payload
    expiresIn: "24h", // expire after 24 hours
  });
  return token;
}

userSchema.methods.comparePassword = async function(password){
  return await bcrypt.compare(password,this.password);
}

userSchema.statics.hashPassword = async function(password){
  return await bcrypt.hash(password,10)
}

const userModel=mongoose.model('user',userSchema);

module.exports=userModel;