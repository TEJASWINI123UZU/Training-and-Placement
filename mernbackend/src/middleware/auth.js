
const cjwt = require("jsonwebtoken");
//const jwt = require("jsonwebtoken");
//const Register = require("../models/registers");
const CRegister = require("../models/cregisters");

//for company side
const cauth = async(req, res, next) =>{
    try {
        const token = req.cookies.cjwt;
        const verifyComp = cjwt.verify(token, process.env.C_SECRET_KEY);
        console.log("hello"+verifyComp);

        const userComp = await CRegister.findOne({_id:verifyComp._id})
        console.log("heya"+userComp);

        req.token = token;
        req.userComp = userComp;

        next();

    } catch(error){
        res.status(401).send(error);
    }
}

module.exports = cauth;



//for student side
/*const auth = async(req, res, next) =>{
    try {
        const token = req.cookies.jwt;
        const verifyStud = jwt.verify(token, process.env.SECRET_KEY_1);
        console.log(verifyStud);

        const userStud = await CRegister.findOne({_id:verifyStud._id})
        console.log(userStud);
        next();

    } catch(error){
        res.status(401).send(error);
    }
}

module.exports = auth;  */

