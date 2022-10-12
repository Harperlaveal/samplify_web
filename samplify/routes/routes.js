const path=require('path')
const express = require('express');
const router = express.Router();
const controller = require('../controller/controller');

router.get('/search', controller.getSearch);

router.get('/playlists', controller.getPlaylists);

router.get('/profile', controller.getProfile);
 
router.post('/search',(req,res,next)=>{
    console.log(req.body)
    res.redirect('/admin')
})

router.get('/', controller.getIndex);
module.exports=router;
