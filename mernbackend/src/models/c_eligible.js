const mongoose=require("mongoose");

const eligible=new mongoose.Schema({
    name :{
        type:String,
        required:true

    },
    Branch :{
        type:String,
        required:true,
        unique:true

    },
 
    pugg :{
        type:String,
        required:true

    },
    beagg :{
        type:String,
        required:true

    },
    curback :{
        type:String,
        required:true

    },
 
    dy :{
        type:String,
        required:true

    }


})

const Eligible = new mongoose.model("Eligible",eligible);

module.exports = Eligible;