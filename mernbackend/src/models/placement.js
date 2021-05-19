const mongoose=require("mongoose");

const placement=new mongoose.Schema({
   
    name:{
        type:String
    },
    email:
    {
        type:String
    },
    branch:
    {
        type:String
    },
    type:
    {
        type:String

    }
    

})

const Placement = new mongoose.model("Placement",placement);

module.exports = Placement