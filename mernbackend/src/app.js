require('dotenv').config();
const express =require("express");
const app = express();
const path =require("path");
var nodemailer=require("nodemailer")
const hbs=require("hbs");
const ejs=require("ejs");
const socketio = require('socket.io');
const http=require('http');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
//var upload = multer()
require("./db/conn");
const bcrypt = require("bcryptjs");
//const jwt = require("jsonwebtoken");
const cjwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cauth = require("./middleware/auth"); 
const sauth = require("./middleware/auth1");


require("C:/updated/Dashboard/mernbackend/bvconnect/server")
const Register = require("./models/registers");
const CRegister = require("./models/cregisters");
const Detail = require("./models/details");
const Announce = require("./models/announce");
const Placement=require("./models/placement");
const CAddpdrive = require("./models/caddpdrive1");
const CUpdate = require("./models/cupdatedrive1");
const Query = require("./models/query");
const Eligible = require("./models/c_eligible");
const Contact = require("./models/contacts");
const CAnnounce = require("./models/cAnnounces");
const Sdrive=require("./models/sdrive");
const Valid = require("./models/compvalid");

var cdet;
var stu;
var branch,twelth,curback,cgpa;

//const { Resolver} = require("dns");
const{json}=require("express");
const { RSA_NO_PADDING } = require("constants");
const port = process.env.PORT || 7001;

const static_path=path.join(__dirname, "../public");
const template_path=path.join(__dirname,"../templates/views");
const partials_path=path.join(__dirname,"../templates/partials");
//const server_path=path.join("C:/tejaswini_dashboard/dashboard/mernbackend/bvconnect/server ");


////admin bro//////
const adminRouter=require('./routers/admin.router');
const { Console } = require('console');

//const registersRouter= require('./routers/registers.router')
//app.use('/users',registersRouter)
app.use('/admin',adminRouter)

///////////////////////////////////////////////////////////

//////////////fetch////////



//const detailFetch=require('./models/details')



////////////////////////////////

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));
app.use(express.static(static_path));

app.set("view engine", "hbs");
app.set("view engine", "ejs");
app.set("views",template_path);
hbs.registerPartials(partials_path);

//app.use(express.static('views/images')); 

//console.log(process.env.SECRET_KEY);

app.get("/",(req,res)=> {
    res.render("index.hbs")
});

app.get("/whyus",(req,res)=>
{
    res.render("whyus.hbs"); 
})

app.get("/contact",(req,res)=>
{
    res.render("contact.hbs"); 
})

app.post("/contact",async(req,res)=>
{
try {
        const contactUs = new Contact({
             firstname:req.body.firstname,
             lastname:req.body.lastname,
             email:req.body.email,
             phone:req.body.phone,
             message:req.body.message 
        })
            const con = await contactSchema.save();
            res.status(201).render("contact.hbs");
    } 
    catch (error) 
    {
        res.status(400).send(error);
    }
})



////company register
app.get("/cregister",(req,res)=>
{
    res.render("cregister.hbs"); 
})
app.post("/cregister",async(req,res)=>{
    try {
        const vemail=req.body.email;
        const check_email= Valid.findOne({email:vemail});
        //console.log(check_email.email);
        if(check_email.email===vemail)
        {
        const password = req.body.pass;
        const cpassword = req.body.re_pass;

            if(password === cpassword ){
                const companyReg = new CRegister({
                    username:req.body.username,
                    email:req.body.email,
                    pass:req.body.pass,
                    re_pass:req.body.re_pass

                })
            //console.log("the success part" + companyReg);

            const token = await companyReg.generateAuthToken();
            //console.log("the token part" + token);

            //set cookie
            res.cookie("cjwt", token, {
                expires:new Date(Date.now() + 600000),          //expires after 10 minutes
                httpOnly:true
            });
            
          //  console.log(cookie);  

            const registered = await companyReg.save();
            //console.log("the page part" + registered);

            
            res.status(201).render("clogin.hbs");
            

        }
    
        else{
            res.send("Your password is incorrect");
        }
    }
    else{
        res.send("Your email is not valid");
    }
    } catch (error) {
    res.status(400).send(error);
    }

})
///company login
app.get("/clogin",(req,res)=>
{
    res.render("clogin.hbs"); 
})
//
app.post("/clogin",async(req,res)=>
{
try {
    const email=req.body.your_name;
    cdet=email;
    console.log("Hello"+cdet);
    const password=req.body.your_pass;

    //console.log(`${email} and password is ${password}`);

    const check_email= await CRegister.findOne({email:email});
    
    //res.send(check_email);
    //console.log(check_email);
    
    const isMatch = await bcrypt.compare(password,check_email.pass);
   
    const token = await check_email.generateAuthToken();
    console.log("the token part" + token);
    
    //set cookie
    res.cookie("cjwt", token, {
        expires:new Date(Date.now() + 600000),          //expires after 10 minutes
        httpOnly:true,
        //secure:true
    });

   if(isMatch)
    {
        res.status(201).render("cdashboard.hbs");
    }
    else
    {
        res.send("Wrong id or paswword");
    }

} catch (error) {
    res.status(400).send("invalid login details");
}
})

app.get("/clogout", cauth, async(req,res) => {
    try {
        console.log(req.userComp);
        
        res.clearCookie("cjwt");
        console.log("logout successfully");

        await req.userComp.save();
        res.render("index.hbs");
    } catch (error) {
        res.status(500).send(error);   
    }
})

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'tnpbanasthalividyapith@gmail.com',
      pass: 'admin@bv'
    }
  });
  var rand,mailOptions,host,link;
  var studentReg;
  

app.get("/register",(req,res)=>
{
    res.render("register.hbs"); 
})

app.post("/register",async(req,res)=>{
    try {
        const password = req.body.pass;
        const cpassword = req.body.re_pass;

        if(password === cpassword ){
            studentReg = new Register({
                username:req.body.username,
                email:req.body.email,
                pass:req.body.pass,
                re_pass:req.body.re_pass

            })

            console.log("the success part" + studentReg);

            const token = await studentReg.generateAuthToken();
            console.log("the token part" + token);

            //set cookie
           res.cookie("cjwt", token, {
                expires:new Date(Date.now() + 600000),          //expires after 10 minutes
                httpOnly:true
            });
            
            rand=Math.floor((Math.random() * 100) + 54);
            host=req.get('host');
            link="http://"+req.get('host')+"/verify?id="+rand;
            mailOptions={
                to : req.body.email,
                subject : "Please confirm your Email account",
                html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
            }
            console.log(mailOptions);
            transporter.sendMail(mailOptions, function(error, response){
             if(error){
                    console.log(error);
                res.end("error");
             }else{
                    console.log("Message sent: " + response.message);
                res.end("<h1>Confirm your email<h1>");
                 }


                });
           // console.log(cookie);
            //const registered = await studentReg.save();
          //console.log("the page part" + registered);
            //res.status(201).render("login.hbs");
      

        }else{
            res.send("Incorrect Password")
        }

    } catch (error) {
    res.status(400).send(error);
    }

})


app.get('/verify',(req,res)=>
{
    console.log(req.protocol+":/"+req.get('host'));
    if((req.protocol+"://"+req.get('host'))==("http://"+host))
    {
        console.log("Domain is matched. Information is from Authentic email");
        if(req.query.id==rand)
        {
            const registered = studentReg.save();
            console.log("email is verified");
            //res.end("<h1>Email "+mailOptions.to+" is been Successfully verified");
            //const registered = await studentReg.save();
            res.render("login.hbs");
        }
        else
        {
            console.log("email is not verified");
            res.end("<h1>Enter a valid email</h1>");
        }
    }
    else
    {
        res.end("<h1>Request is from unknown source");
    }
    }); 
 
  


app.get("/login",(req,res)=>
{
    res.render("login.hbs"); 
})

app.post("/login",async(req,res)=>
{
try {
    const email=req.body.your_name;
    stu=email;
    const password=req.body.your_pass;

    const check_email= await Register.findOne({email:email});

    const isMatch = await bcrypt.compare(password, check_email.pass);

   const token = await check_email.generateAuthToken();
    console.log("the token part" + token);
    
    //set cookie
    res.cookie("cjwt", token, {
        expires:new Date(Date.now() + 6000000),          //expires after 10 minutes
        httpOnly:true,
        //secure:true
    });

   if(password===check_email.pass)
    {
     res.status(201).redirect("/slogin");
    }
    else
    {
        res.send('<script type="text/javascript"> alert("Wrong Password!! Go back to the login page."); window.location.href = "login";</script>;')
    }

} catch (error) {
   // res.status(400).send("invalid login details");
   alert("invalid login")
}
})

app.get("/logout", sauth, async(req,res) => {
    try {
        console.log(req.userStud);
        
        res.clearCookie("cjwt");
        console.log("logout successfully");

        await req.userStud.save();
        res.render("index.hbs");
    } catch (error) {
        res.status(500).send(error);   
    }
})

app.get("/slogin", sauth, (req,res)=> {
    //console.log(`this is the cookie awesome ${req.cookies.cjwt}`);
    Detail.find({Email: stu},function(err,image){
        res.render("slogin.ejs",{
            imageList:image
        })
    })
    //res.render("slogin.hbs")
});



app.get("/detail", sauth, (req,res)=> {
    Detail.find({Email: stu},function(err,image){
        res.render("detail.ejs",{
            imageList:image
        })
    })
    console.log(`this is the cookie awesome ${req.cookies.cjwt}`);
   // res.render("detail.ejs")
});

//////multer.//////



////////multer upload/////////

var Storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function (req, file, cb) {
      
      cb(null, file.fieldname + '_' + Date.now()+path.extname(file.originalname))
    }
  })
  
  var upload = multer({ storage: Storage }).single("fileToUpload")



app.post("/detail",upload,async(req,res)=>{
    try {
        //console.log(req.body.Fname);
        //res.send(req.body.Fname);
       
            const studentDetails = new Detail({
                
                Fname:req.body.Fname,
                Lname:req.body.Lname,
                USN:req.body.USN,
                Num:req.body.Num,
                Email:req.body.Email,
                DOB:req.body.DOB,
                Cursem:req.body.Cursem,
                Branch:req.body.Branch,
                Percentage:req.body.Percentage,
                Puagg:req.body.Puagg,
                Beagg:req.body.Beagg,
                Backlogs:req.body.Backlogs,
                History:req.body.History,
                Dety:req.body.Dety,
                fileToUpload:req.file.filename

    });
 
        const registerD = await studentDetails.save();
        res.status(201).redirect("/slogin");

    } catch (error) {
    res.status(400).send(error);
    }

})


app.get("/sdupdate",(req,res)=> {
    Detail.find({Email: stu},function(err,updetail){
        res.render("sdupdate.ejs",{
            updetailList:updetail,
             //imageList:image
        })
    })
});

app.post('/sdupdate',upload, (req, res) => {
    if(req.file){
        var update = {
            Fname:req.body.Fname,
            Lname:req.body.Lname,
            USN:req.body.USN,
            Num:req.body.Num,
            Email:req.body.Email,
            DOB:req.body.DOB,
            Cursem:req.body.Cursem,
            Branch:req.body.Branch,
            Percentage:req.body.Percentage,
            Puagg:req.body.Puagg,
            Beagg:req.body.Beagg,
            Backlogs:req.body.Backlogs,
            History:req.body.History,
            Dety:req.body.Dety,
            fileToUpload:req.file.filename
           
        }
    }
else
{  
    var update = {
        Fname:req.body.Fname,
        Lname:req.body.Lname,
        USN:req.body.USN,
        Num:req.body.Num,
        Email:req.body.Email,
        DOB:req.body.DOB,
        Cursem:req.body.Cursem,
        Branch:req.body.Branch,
        Percentage:req.body.Percentage,
        Puagg:req.body.Puagg,
        Beagg:req.body.Beagg,
        Backlogs:req.body.Backlogs,
        History:req.body.History,
        Dety:req.body.Dety
   
        }
    }
  
    Detail.findOneAndUpdate({Email:stu}, {$set:update} ,  {new: true}, (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data!");
        }
        else{
            res.redirect("/slogin");
        }
    })
    
   });


/////FETCHING DATA /////////*
app.get("/fetch",(req,res)=> 
{
    
    Detail.find({Email:stu},function(err,details){
        res.render("user-table.ejs",{
            detailList:details
        })
    })
})

//////fetching details for sdrive



app.get("/sdrive",(req,res)=>
{
  
    Sdrive.find({},function(err,sdrive){
     Detail.find({Email:stu},function(err,image){
        res.render("sdrive.ejs",
        {
             slist:sdrive,
             imageList:image
         })

     })
       
        
    })
})


app.get("/announce", sauth, (req,res)=>
{
    //console.log(`this is the cookie awesome ${req.cookies.cjwt}`);
    Announce.find({},function(err,announce){
        Detail.find({Email:stu},function(err,image){
        res.render("announce.ejs",{

            announceList:announce,
            imageList:image
        })
})
})
})
app.get("/placement", sauth, (req,res)=>
{
    console.log(`this is the cookie awesome ${req.cookies.cjwt}`);
    Placement.find({},function(err,placement){
        res.render("placement.ejs",{
            placementList:placement
        })
    })
})






app.get("/mat", (req,res)=>
{
    
    res.render("mat.ejs");
});

/////////////////////////////////    UPLOAD   ////////////////////////////////








 
   
    

 


/////////////////////////////////////////////////vanshika//////////////////////////////////////////
app.get("/cdashboard", cauth, (req,res)=>                         //authentication
{
    console.log(`this is the cookie awesome ${req.cookies.cjwt}`);
    res.render("cdashboard.hbs"); 
})

app.get("/cPlacement_Drives", cauth, (req,res)=>
{
    console.log(`this is the cookie awesome ${req.cookies.cjwt}`);
    res.render("cPlacement_Drives.hbs"); 
})


app.get("/caddpdrive", cauth, (req,res)=>
{
    console.log(`this is the cookie awesome ${req.cookies.cjwt}`);
    res.render("caddpdrive.hbs"); 
})



app.get("/cupdate", cauth, (req,res)=>
{
    console.log(`this is the cookie awesome ${req.cookies.cjwt}`);
    res.render("cupdate.hbs"); 
})

app.post("/caddpdrive",async(req,res)=>
{
    try {
        
            const companyDrive = new CAddpdrive({
                compny:req.body.compny,
                date:req.body.date,
                campool:req.body.campool,
                pcv:req.body.pcv,
                email:req.body.email,
                odetails:req.body.odetails

            })
    
           const addDrive = await companyDrive.save();
            res.status(201).render("cPlacement_Drives.hbs");
      

        }
     catch (error) {
    res.status(400).send(error);
    }

})

app.get("/cCompanyDetails", cauth, (req,res)=>
{
    ///console.log(`this is the cookie awesome ${req.cookies.cjwt}`);
    //CAddpdrive.findOneAndUpdate({_id: req.session._id },{$set:{
    
   // const email=req.register.email;
    
//console.log(compny);
   //  console.log("hello");
    // console.log(_id);

    console.log(cdet);
    CAddpdrive.find({email: cdet},function(err,caddpdrive1){
        res.render("companyDetails.ejs",{
           compdetailList:caddpdrive1
    })
    })
})




app.get("/cupdate", cauth, (req,res)=>
{
    console.log(`this is the cookie awesome ${req.cookies.cjwt}`);
    res.render("cupdate.hbs"); 
})

app.post("/cupdate",async(req,res)=>
{
    try {
        
            const companyUpdate = new CUpdate({
                usn:req.body.usn,
                sname:req.body.sname,
                comname:req.body.comname,
                Date:req.body.Date,
                Attendance:req.body.Attendance,
                WrittenTest:req.body.WrittenTest,
                GD:req.body.GD,
                Tech:req.body.Tech,
                Placed:req.body.Placed
                
            })
            const update = await companyUpdate.save();
            res.status(201).render("cPlacement_Drives.hbs");
      

        }
     catch (error) {
    res.status(400).send(error);
    }

})



////////////////////////////testttttttt///////////////////////

app.get("/cCompanyDetails", cauth, (req,res)=>
{
    CAddpdrive.find({},function(err,caddpdrive1){
        res.render("companyDetails.ejs",{
           compdetailList:caddpdrive1
    })
    })
})
//module.exports=router
app.get("/cdrivehome", cauth, (req,res)=>
{
    console.log(`this is the cookie awesome ${req.cookies.cjwt}`);
    res.render("cdrivehome.hbs"); 
})

app.get("/cUpload", cauth, (req,res)=>
{
    console.log(`this is the cookie awesome ${req.cookies.cjwt}`);
    res.render("cUpload.hbs"); 
})

app.get("/cmanage_users", cauth, (req,res)=> 
{
    //console.log(`this is the cookie awesome ${req.cookies.cjwt}`);

    Detail.find({Branch:branch,Puagg:{$gte : twelth},Beagg:{$gte:cgpa}},function(err,details){
        res.render("c_table.ejs",{
            detailList:details
        })
    })
})


app.post("/cqueries", async(req,res)=>
{
    try {
        
            const cQuery = new Query({
                ques:req.body.ques
            })
            const query = await cQuery.save();
            res.status(201).render("cqueries.ejs");
      

        }
     catch (error) {
    res.status(400).send(error);
    }

})

app.get("/cqueries", cauth, (req,res)=>
{
    console.log(`this is the cookie awesome ${req.cookies.cjwt}`);
    res.render("cqueries.ejs")
})

app.get("/qans",(req,res)=>
{

    Query.find({},function(err,query){
        res.render("qans.ejs",{
            queryList:query
        })
    })
})

app.get("/cStudents_Eligibility", cauth, (req,res)=>
{
    console.log(`this is the cookie awesome ${req.cookies.cjwt}`);
    res.render("cStudents_Eligibility.hbs"); 
})


app.get("/cAnnounce", cauth, (req,res)=>
{
    console.log(`this is the cookie awesome ${req.cookies.cjwt}`);
    //Announce.find({},function(err,announce){
        res.render("cAnnounce.hbs");  //,{

            //announceList:announce
        //})
//})
})

app.post("/cAnnounce",async(req,res)=>
{
    try {
        
            const compAnnounce = new CAnnounce({
                makeannc:req.body.makeannc
            })
            const announce = await compAnnounce.save();
            res.status(201).render("cdashboard.hbs");
      

        }
     catch (error) {
    res.status(400).send(error);
    }

})

app.get("/Updates",(req,res)=>
{
    CAnnounce.find({},function(err,query){
        res.render("viewUpdates.ejs",{
            updateList:query
        })
    })
})


app.post("/cStudents_Eligibility",async(req,res)=>{
    try {
        //console.log(req.body.Fname);
        //res.send(req.body.Fname);
       branch=req.body.Branch;
       cgpa=req.body.beagg;
       twelth=req.body.pugg;
       curback=req.body.curback;

            const studentEligible = new Eligible({
                
                name:req.body.name,
                Branch:req.body.Branch,
                pugg:req.body.pugg,
                beagg:req.body.beagg,
                curback:req.body.curback,
                dy:req.body.dy
                

    });
 
        const eligible = await studentEligible.save();
        res.status(201).render("cdashboard.hbs");

    } catch (error) {
    res.status(400).send(error);
    }

})


app.get("/graph",(req,res)=>
{
        res.render("graph.hbs")
})




//// Password Restting //////////////////


var fprand,mailOption,fplink;

app.get("/forgotpassword",(req,res)=>
{
        res.render("pass.hbs")
})

var fpemail;

app.post("/forgotpassword",async(req,res)=>{
    
    fprand=Math.floor((Math.random() * 100) + 54);
            host=req.get('host');
            fpemail=req.body.email;
            link="http://"+req.get('host')+"/fpverify?id="+fprand;
            mailOption={
                to : req.body.email,
                subject : "Please confirm your Email account",
                html : "Hello,<br> Please Click on the link to reset your password.<br><a href="+link+">Click here to verify</a>" 
            }
            
            transporter.sendMail(mailOption, function(error, response){
             if(error){
                    console.log(error);
                res.end("error");
             }else{
                res.end("<h1>Confirm your email to reset password<h1>");
                 }
                });
})

app.get('/fpverify',(req,res)=>
{
    console.log(req.protocol+":/"+req.get('host'));
    if((req.protocol+"://"+req.get('host'))==("http://"+host))
    {
        console.log("Domain is matched. Information is from Authentic email");
        if(req.query.id==fprand)
        {
            console.log("email is verified");
            //res.end("<h1>Email "+mailOptions.to+" is been Successfully verified");
            //const registered = await studentReg.save();
            res.render("repass.hbs");
        }
        else
        {
            console.log("email is not verified");
            res.end("<h1>Enter a valid email</h1>");
        }
    }
    else
    {
        res.end("<h1>Request is from unknown source");
    }
    }); 
 
app.get("/repass",(req,res)=>
{
    res.render("repass.hbs");
})


app.post('/repass', (req, res) => {

    var pass=req.body.pass;
    var re_pass=req.body.re_pass;
        var fpupdate = {
            pass:pass,
            re_pass:re_pass
        }
        if(pass===re_pass){
            Register.findOneAndUpdate({email:fpemail}, {$set:fpupdate} ,  {new: true}, (err, doc) => {
            if (err) {
            console.log("Something wrong when updating data!");
            }
            else{
            res.redirect("/login");
            }
    
    })
        }
    
   });

   app.get("/valid",(req,res)=>
   {
       res.render("validation.hbs");
   })
  


////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////// CX
app.listen(port, ()=>{
    console.log(`server is running at port no ${port}`);
})