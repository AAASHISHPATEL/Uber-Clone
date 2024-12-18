const mongoose=require('mongoose');

function connectToDB(){
   mongoose.connect(process.env.DB_KEY).then(()=>{
    console.log('Connected To DB');
  }).catch(err=>console.log(err));
   
}

module.exports =connectToDB;