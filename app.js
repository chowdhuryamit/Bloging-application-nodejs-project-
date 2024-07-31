require('dotenv').config();

const express=require('express');
const path=require('path');
const mongoose=require('mongoose');
const cookieParser=require('cookie-parser');
const {checkForAuthenticaionCookie}=require('./middlewire/authentication.js');
const Blog=require('./models/blog.js');

const app=express();
const port=process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URL)//mongodb://127.0.0.1:27017/bloging
.then((res)=>console.log(`monogdb connected sucessfully at port ${port}`))
.catch((err)=>console.log(err));


app.set('view engine','ejs');
app.set('views',path.join(__dirname,'./views'));

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticaionCookie('token'));
app.use(express.static(path.resolve('./public')));
app.use('assets',express.static('assets'));


const userRoute=require('./routes/user.js');
const blogRoute=require('./routes/blog.js')

app.get('/',async(req,res)=>{
    const allblogs=await Blog.find();
    return res.render('home.ejs',{
        user:req.user,
        blogs:allblogs,
    })
})

app.use('/user',userRoute);
app.use('/blog',blogRoute)

app.listen(port,()=>console.log(`server started at port ${port}`));