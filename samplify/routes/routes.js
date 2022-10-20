const path=require('path')
const express = require('express');
const router = express.Router();
const controller = require('../controller/controller');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { doc, getDoc, FieldValue } = require('firebase-admin/firestore');

router.use(express.static(path.join(__dirname,'public')));

router.get('/search', controller.getSearch);

router.get('/playlists', controller.getPlaylists);

router.get('/profile', controller.getProfile);

router.get('/login', controller.getLogin);

router.get('/register', controller.getSignin);

router.get('/', controller.getIndex);

router.get('/playlists/:username', controller.getPlaylistsDynamic)

//router.get('/playlists/:songname', controller.getPlaylistsDynamic)

const db=require('../firebase');
const users=db.collection('users');
const playlists=db.collection('playlists');

const initializePassport = require('./passport-config');
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

router.post('/search', async (req,res) => {
    try{
        await db.collection('playlists').doc('cMplNtDhhoXKXUBla6HJ').update({
            samples:FieldValue.arrayUnion(req.body),
        });

        res.redirect('/search');
    }
    catch{
        res.redirect('/login');
    }
})

router.post('/register', checkNotAuthenticated, async (req,res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const userid = uuidv4();
        const plid = uuidv4();
        await users.add({
            name: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            id: userid,
            plid: plid,
        });
        await playlists.add({
            title: '',
            description: '',
            id: plid,
            userid: userid,
            samples: [],
        });
        res.redirect('/login');
    } catch {
        res.redirect('/register');
    }
})

router.delete('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

module.exports=router;
