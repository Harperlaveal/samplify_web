const path=require('path')
const express = require('express');
const router = express.Router();
router.get('/search',(req, res, next)=>{
    //res.sendFile(path.join(__dirname,'..','views','search.html'))
    res.render('search');
});
router.get('/playlists',(req, res, next)=>{
    res.render('playlists');
});
router.get('/profile',(req, res, next)=>{
    res.render('profile');
});

router.post('/search',(req,res,next)=>{
    console.log(req.body)
    res.redirect('/admin')
})

router.get('/',(req, res, next)=>{
    res.render('index')
});
module.exports=router;
