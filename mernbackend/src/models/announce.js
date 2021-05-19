const mongoose=require("mongoose");

const announce=new mongoose.Schema({
   
    data:{
        type:String
    }
})

const Announce = new mongoose.model("Announce",announce);

module.exports = Announce;