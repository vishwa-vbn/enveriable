//jshint esversion:6
require('dotenv').config(); //must be at the top
const express=require("express");
const bodyparser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");


const app=express();
console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended:true}));


mongoose.connect("mongodb://localhost:27017/userDB",{ useNewUrlParser :true});

//user schema creation

const userschema= new mongoose.Schema({
    email:String,
    password:String
});


//encrypting the data level 2 encryption


userschema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

//install dotenv environmental vairable

const User=new mongoose.model("User",userschema);

app.get("/",function(req,res)
{
    //rendering the home page
    res.render("home");
});






app.get("/login",function(req,res)
{
    //rendering the home page
    res.render("login");
});




app.get("/register",function(req,res)
{
    //rendering the home page
    res.render("register");
});

//getting the password and email from html files
app.post("/register",function(req,res)
{
    const newuser= new User({
        email:req.body.username,
        password:req.body.password

    })
    newuser.save(function(err)
    {
        if(err)
        {
            console.log(err);

        }
            else{
                res.render("secrets")
            }
        
    });
})


//for loging in the user

app.post("/login",function(req,res)
{
    const username=req.body.username;
    const userpassword=req.body.password;

    User.findOne({email:username},function(err,founduser)
    {
        if(err){
            console.log(err);
        }
        else
        {
            if(founduser)
            {
                if(founduser.password===userpassword)
                {
                    res.render("secrets");
                }else{
                    res.render("login");
                    
                }
            }
        }
        });

});


















app.listen(3000,function()
{
    console.log("server started on port 3000.");
});
