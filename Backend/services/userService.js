const userModel=require('../models/user_model');

module.exports.createUser= async ({fullname,email,password}) => {
    if(!fullname.firstname || !email || !password){
        throw new Error('All feilds are required');
    }
    const user=userModel.create({
        fullname:{
            firstname:fullname.firstname,
            lastname:fullname.lastname,
        },
        email,
        password
    })
    // if(user) console.log(user);
    return user;
}