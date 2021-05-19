const cjwt = require("jsonwebtoken");
//const jwt = require("jsonwebtoken");
const Register = require("../models/registers");
//const CRegister = require("../models/cregisters");

//for company side
const sauth = async(req, res, next) =>{
    try {
        const token = req.cookies.cjwt;
        const verifyStud = cjwt.verify(token, process.env.SECRET_KEY);
        console.log(verifyStud);

        const userStud = await Register.findOne({_id:verifyStud._id})
        console.log(userStud);

        req.token = token;
        req.userStud = userStud;

        next();

    } catch(error){
        res.status(401).send(error);
    }
}

module.exports = sauth;
