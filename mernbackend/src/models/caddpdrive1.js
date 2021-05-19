//const bcrypt = require("bcryptjs");
//const cjwt = require("jsonwebtoken");
const mongoose=require("mongoose");

const comSchema=new mongoose.Schema({
    compny :{
        type:String,
        required:true

    },
    date :{
        type:String,
        required:true,
        unique:true

    },
    campool :{
        type:String,
        required:true

    },
    pcv :{
        type:String,
        required:true

    },

    email :{
        type:String,
        required:true

    },
	
	odetails :{
        type:String,
        required:true

    }
    //tokens:[{
    //    token:{
    //        type:String,
      //      required:true
    //    }
  //  }]
      

})

/*comSchema.methods.generateAuthToken = async function(){
    try{
        console.log(this._id);
        const token = cjwt.sign({_id:this._id.toString()}, process.env.C_SECRET_KEY);
        this.tokens = this.tokens.concat({token:token})
        await this.save();
        return token;
    } catch(error) {
        res.send("the error part + error");
        console.log("the error part + error");
    }
}
*/
//converting password into hash

    


const CAddpdrive = new mongoose.model("CAddpdrive",comSchema);

module.exports = CAddpdrive;