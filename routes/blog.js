const {Router}=require('express');
const multer=require('multer');
const path=require('path');
const Blog=require('../models/blog');
const comment=require('../models/comment');


const router=Router();


const storage=multer.diskStorage({
    destination:function (req,file,cb) {
        cb(null,path.resolve(`./public/uploads/`));
    },
    filename:function (req,file,cb) {
        const fileName=`${Date.now()}-${file.originalname}`;
        cb(null,fileName);
    }
})
const upload=multer({storage:storage});


router.get('/add-new',(req,res)=>{
    return res.render('addBlog',{
        user:req.user,
    });
});

router.post('/add-new',upload.single('coverImage'),async(req,res)=>{
    const {title,body}=req.body;
    // console.log(req);
    const blog=await Blog.create({
          title,
          body,
          createdBy:req.user._id,
          coverImg:`/uploads/${req.file.filename}`
    })
    return res.redirect(`/blog/${blog._id}`);
})

router.get('/:id',async(req,res)=>{
    const blog=await Blog.findById(req.params.id).populate('createdBy');
    const Comments=await comment.find({blogId:req.params.id}).populate('createdBy');
    return res.render('blog',{
        user:req.user,
        blog:blog,
        Comments:Comments,
    })
})

router.post('/comment/:blogId',async(req,res)=>{
   await comment.create({
      content:req.body.content,
      blogId:req.params.blogId,
      createdBy:req.user._id,
   })
   return res.redirect(`/blog/${req.params.blogId}`);
})


module.exports=router;