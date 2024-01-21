import http from "http";
import express from "express"; 
import path from "path";
import mongoose from "mongoose";
//cookie parser allows us to access the cookies
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken"

mongoose.connect("mongodb://localhost:27017",{
    dbName:"backend"
})
.then(()=>console.log("Database connected"))
.catch((e)=>console.log(e));

const UserSchema=new mongoose.Schema({
    name:String,
    email:String,
}) 

const User=mongoose.model("User",UserSchema);

//starting server
const app = express(); 
 
//using all middlewares here
app.use(express.static(path.join(path.resolve(),"public")));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

//setting up view engine 
app.set("view engine","ejs");

const isAuthenticated=async(req,res,next)=>{
    const token=req.cookies.token;
    if(token){
        const decoded=jwt.verify(token,"ugvugvuvugv");
        req.user=await User.findById(decoded._id);
        console.log(res.user);
        next();
        // res.render("logout");
    }
    else {
        res.render("login");
    }
};

app.get('/',isAuthenticated,(req,res)=>{
    // console.log(req.user);
    res.render("logout");
})
app.get('/', (req, res) => {
    const pathlocation=path.resolve();
    res.render("login", {name:"rajeev"});
})
app.get('/add', async(req, res) => {
    await Messge.create({name:"rajeev",email:"rajeev.hmdagwal@gmail.com"})
        res.send("Nice");
    
})

app.post("/login",async(req,res)=>{
    const {name,email}=req.body
    const user=await User.create({name,email});
    // console.log(req.body);
    const token=jwt.sign({id:user._id},"ugvugvuvugv");
    // console.log(token);
    res.cookie("token",token,{
        httpOnly:true,
        expires:new Date(Date.now()+60*1000),
    });
    // console.log(req.cookies.token);
    res.redirect('/');
})
app.get("/logout",(req,res)=>{
    res.cookie("token","null",{
        httpOnly:true,
        expires:new Date(Date.now()),
    });
    res.redirect('/');
})


app.listen(5000,()=>{
    console.log("Server is working");
}) 

