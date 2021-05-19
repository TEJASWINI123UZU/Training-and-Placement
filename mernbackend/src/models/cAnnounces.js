const mongoose=require("mongoose");

const cannounce=new mongoose.Schema({
   
    makeannc:{
        type:String
    }
})

const CAnnounce = new mongoose.model("CAnnounce",cannounce);

module.exports = CAnnounce;