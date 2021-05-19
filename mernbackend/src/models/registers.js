const mongoose=require("mongoose");
const bcrypt = require("bcryptjs");
const cjwt = require("jsonwebtoken");

const studentSchema=new mongoose.Schema({
    username :{
        type:String,
        required:true

    },
    email :{
        type:String,
        required:true,
        unique:true

    },
    pass :{
        type:String,
        required:true

    },
    re_pass :{
        type:String,
        required:true

    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]

})

//generating token
studentSchema.methods.generateAuthToken = async function(){
    try{
        console.log(this._id);
        const token = cjwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token})
        await this.save();
        return token;
    } catch(error) {
        res.send("the error part + error");
        console.log("the error part + error");
    }
}

// converting password into hash
studentSchema.pre("save", async function(next){

    if(this.isModified("pass")){
        //console.log(`the current password is ${this.pass}`);
        this.pass = await bcrypt.hash(this.pass, 10);
        this.re_pass = await bcrypt.hash(this.pass, 10);
        //console.log(`the current password is ${this.pass}`);

     //   this.re_pass = undefined;
    }

    next();
})


const Register = new mongoose.model("Register",studentSchema);

module.exports = Register;