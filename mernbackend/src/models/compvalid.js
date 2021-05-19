const mongoose=require("mongoose");

const valid=new mongoose.Schema({
   
    email:{
        type:String,
        unique:true
    }
})

const Valid = new mongoose.model("Valid",valid);

module.exports = Valid;