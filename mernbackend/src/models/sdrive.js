const mongoose=require("mongoose");

const sdrive=new mongoose.Schema({
   
    name:{
        type:String,
    },
    position:{
        type:String,
    },
    domain:{
        type:String,
    },
    link:{
        type:String,
    },
    date:{
        type:String,
    }

})

const Sdrive = new mongoose.model("Sdrive",sdrive);

module.exports = Sdrive;