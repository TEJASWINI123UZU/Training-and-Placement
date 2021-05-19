const mongoose=require("mongoose");

const material=new mongoose.Schema({
   
    fileUpload:{
        type:String
    }
})

const Material = new mongoose.model("Material",material);

module.exports = Material;