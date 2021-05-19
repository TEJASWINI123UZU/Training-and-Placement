const mongoose=require("mongoose");

const query=new mongoose.Schema({
   
    ques:{
        type:String
    },
    ans:{
        type:String,
        default: ''
    }
})

const Query = new mongoose.model("Query",query);

module.exports = Query;