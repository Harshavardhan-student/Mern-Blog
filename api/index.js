    const express = require('express')
    const cors = require('cors')
    const mongoose = require('mongoose')
    const User = require('./models/User')
    const bcrypt = require('bcryptjs')
    const jwt = require('jsonwebtoken')
    const app = express()
    const cookieParser = require('cookie-parser')
    const multer = require('multer')
    const uploadMiddleware = multer({dest:'uploads/'})
    const fs = require('fs')
    const path = require('path'); 
    const Post = require('./models/Post')

    const salt = bcrypt.genSaltSync(10);
    const secret = 'asgvdqwbdwehnbwjnfhw'

    app.use(cors({credentials:true,origin:'http://localhost:3000'}))
    app.use(express.json())
    app.use(cookieParser())
    app.use('/uploads',express.static(__dirname+'/uploads'))

  mongoose.connect("mongodb+srv://blog:harsha1234@cluster0.wzylaip.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0")

    app.post("/register",async (req,res)=>{
        const {username,password} = req.body
        try{
            const userDoc = await User.create({username,
                password:bcrypt.hashSync(password,salt)
            })
            res.json(userDoc)
        }catch(e){
            res.status(400).json(e)
        }
        
    })

    app.post("/login",async (req,res)=>{
        const {username,password} = req.body
        const userDoc = await User.findOne({username})
        const passOk = bcrypt.compareSync(password,userDoc.password)
        if(passOk){
            jwt.sign({username,id:userDoc.id},secret,{},(err,token)=>{
                if(err){
                    throw err;
                }
                res.cookie('token',token).json({
                    id:userDoc._id,
                    username,
                })
            })
        }
    else{
        res.status(400).json('wrong credentials')
    }
    })

    app.get('/profile',(req,res) =>{
        const {token} = req.cookies
        jwt.verify(token,secret,{},(err,info)=>{
            if(err){
                throw err
            }
            res.json(token)
        })
    
    })

    app.post('/logout',(req,res)=>{
        res.cookie('token','').json('ok')
    })


   /* app.post('/post', uploadMiddleware.single('file'),async (req, res) => {
    const { originalname, path: tempPath } = req.file;
    const ext = originalname.split('.').pop();
    const newPath = tempPath + '.' + ext;

    fs.renameSync(tempPath, newPath); 

    const {token} = req.cookies;
    jwt.verify(token,secret,{},async (err,info)=>{
        if(err){
            throw err
        }
        
    })

    const {title,summary,content} = req.body

    const postDoc = await Post.create({
        title,summary,content,cover:newPath,author:info.id
    })
    res.json(postDoc);

    });*/

    app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
      const { originalname, path: tempPath } = req.file;
      const ext = originalname.split('.').pop();
      const newPath = tempPath + '.' + ext;
    
      fs.renameSync(tempPath, newPath);
    
      const { token } = req.cookies;
      jwt.verify(token, secret, {}, async (err, info) => {
        if (err) return res.status(401).json({ error: "Unauthorized" });
    
        const { title, summary, content } = req.body;
    
        try {
          const postDoc = await Post.create({
            title,
            summary,
            content,
            cover: newPath,
            author: info.id,
          });
    
          res.json(postDoc);
        } catch (error) {
          console.error("Failed to create post:", error);
          res.status(500).json({ error: "Failed to create post" });
        }
      });
    });
    

    app.put('/post',uploadMiddleware.single('file'),async (req,res)=>{
      let newPath = null
      if(req.file){
          const { originalname, path: tempPath } = req.file;
          const ext = originalname.split('.').pop();
           newPath = tempPath + '.' + ext;
          fs.renameSync(tempPath, newPath);
      }
      const {token} = req.cookies
      jwt.verify(token, secret, {}, async (err, info) => {
          if (err) return res.status(401).json({ error: "Unauthorized" });
         
          const { id,title, summary, content } = req.body;
      
          const postDoc = await Post.findById(id)
          const isAuthor = JSON.stringify(postDoc.author)===JSON.stringify(info.id) 
          if(!isAuthor){
            return res.status(400).json('you are not author')
            
          }
          await postDoc.updateOne({
            title,summary,content,
            cover:  newPath?newPath:postDoc.cover
          })
          
            res.json(postDoc);
          })
      }
    )

    /*
app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
  let newPath = null;

  // Handle file upload if provided
  if (req.file) {
      const { originalname, path: tempPath } = req.file;
      const ext = originalname.split('.').pop();
      newPath = tempPath + '.' + ext;
      fs.renameSync(tempPath, newPath); // Rename file with proper extension
  }

  const { token } = req.cookies;

  // Verify token and retrieve user info
  jwt.verify(token, secret, {}, async (err, info) => {
      if (err) return res.status(401).json({ error: "Unauthorized" });

      const { id, title, summary, content } = req.body;

      // Check if 'id' exists in the request body
      if (!id) {
          return res.status(400).json({ error: "Post ID is required" });
      }

      // Check if the 'id' is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ error: "Invalid Post ID" });
      }

      try {
         // const postDoc = await Post.findById(id);
         const postDoc = await Post.findById(new mongoose.Types.ObjectId(id));

          // If post not found
          if (!postDoc) {
              return res.status(404).json({ error: "Post not found" });
          }

          // Check if the logged-in user is the author of the post
          const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
          if (!isAuthor) {
              return res.status(403).json({ error: "You are not the author of this post" });
          }

          // Update post data
          await postDoc.updateOne({
              title,
              summary,
              content,
              cover: newPath ? newPath : postDoc.cover, // Keep old cover if no new file
          });

          // Return the updated post
          res.json(postDoc);
      } catch (updateErr) {
          console.error("Failed to update post:", updateErr);
          res.status(500).json({ error: "Failed to update post" });
      }
  });
});*/

    app.get('/post', async (req, res) => {
      const posts = await Post.find()
        .populate('author', ['username'])  
        .sort({ createdAt: -1 })   
        .limit(20);                        
    
      res.json(posts);
    });

    app.get('/post/:id', async (req,res)=>{
         const {id} = req.params
         const postDoc = await Post.findById(id).populate('author',['username'])
         res.json(postDoc)
    })
      /*   app.get('/post/:id', async (req, res) => {
          const { id } = req.params;
          
          // Ensure the id is a valid ObjectId
          if (!mongoose.Types.ObjectId.isValid(id)) {
              return res.status(400).json({ error: "Invalid post ID" });
          }
          
          try {
              const postDoc = await Post.findById(id).populate('author', ['username']);
              if (!postDoc) {
                  return res.status(404).json({ error: "Post not found" });
              }
              res.json(postDoc);
          } catch (err) {
              console.error("Error fetching post:", err);
              res.status(500).json({ error: "Failed to fetch post" });
          }
      });*/
      
    
  app.listen(4000)

