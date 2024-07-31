const express=require('express');
const User=require('../models/user');
const {createToken,validateToken}=require('../service/auth.js');
const multer=require('multer');
const path=require('path');

const router=express.Router();



const storage=multer.diskStorage({
    destination:function (req,file,cb) {
        cb(null,path.resolve(`./public/dp/`));
    },
    filename:function (req,file,cb) {
        const fileName=`${Date.now()}-${file.originalname}`;
        cb(null,fileName);
    }
})
const upload=multer({storage:storage});


router.get('/signin',(req,res)=>{
   return res.render('signin');
})

router.get('/signup',(req,res)=>{
    return res.render('signup');
 })

 router.post('/signin',async(req,res)=>{
    const {email,password}=req.body;
    const user=await User.findOne({email,password});
    if (!user) {
        return res.render('signin',{
            err:'Invalid email or password',
        })
    }
    else{
        const token=createToken(user);
        res.cookie('token',token);
        return res.redirect('/');
    }
 })

 router.post('/signup',upload.single('profilePic'),async(req,res)=>{
    const {fullName,email,password}=req.body;
    const existFullname=await User.findOne({email});
    const existPassword=await User.findOne({password});
    if(existFullname){
        return res.render('signup',{
            err:'Email address is already in use. Please use a different email or log in.',
        })
    }
    else if (existPassword) {
        return res.render('signup',{
            err:'Password must be unique. Please choose a different password.',
        })
    }
    else{
        await User.create({
            fullName,
            email,
            password,
            profileImg:`/dp/${req.file.filename}`,
        });
        return res.redirect('/');
        
    }
 })

 router.get('/logout',(req,res)=>{
    res.clearCookie('token').redirect('/');
 })


module.exports=router;