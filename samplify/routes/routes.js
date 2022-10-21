const path=require('path')
const express = require('express');
const router = express.Router();
const controller = require('../controller/controller');
const passport = require('passport');
const { FieldValue } = require('firebase-admin/firestore');

router.use(express.static(path.join(__dirname,'public')));

router.get('/search', checkAuthenticated, controller.getSearch);

router.get('/not-search', checkNotAuthenticated, controller.unauthSearch);

router.get('/playlists', checkAuthenticated, controller.getPlaylists);

router.get('/profile', checkAuthenticated, controller.getProfile);

router.get('/login', checkNotAuthenticated, controller.getLogin);

router.get('/register', checkNotAuthenticated, controller.getSignin);

router.get('/', checkAuthenticated, controller.getIndex);

router.get('/playlists/:username', controller.getPlaylistsDynamic);

router.get('/json/:username', controller.getJson);

router.post('/login', controller.postLogin);

const db=require('../firebase');
const users=db.collection('users');
const initializePassport = require('./passport-config');
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

router.post('/register', checkNotAuthenticated, controller.postRegister);

router.post('/profile', controller.postSignout);

router.post('/search', async (req,res) => {
    try{
        const userdoc = await users.doc(req.cookies.uid).get();
        const plid = userdoc.data().plid;
        await db.collection('playlists').doc(plid).update({
            samples:FieldValue.arrayUnion(req.body),
        });

        res.redirect('/search');
    }
    catch{
        res.redirect('/login');
    }
})

router.post('/playlists/edit', async (req,res) => {
    try{
        const userdoc = await users.doc(req.cookies.uid).get();
        const plid = userdoc.data().plid;
        await db.collection('playlists').doc(plid).update({
            title: req.body.title,
            description: req.body.desc
        });
        
        res.redirect('/playlists');
    }
    catch{
        res.redirect('/profile');
    }
})

router.post('/playlists/clear', async (req,res) => {
    try{
        const userdoc = await users.doc(req.cookies.uid).get();
        const plid = userdoc.data().plid;
        await db.collection('playlists').doc(plid).update({
            samples: []
        });
        
        res.redirect('/playlists');
    }
    catch{
        res.redirect('/profile');
    }
})

router.delete('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
})

async function checkAuthenticated(req, res, next) {
    if (await checkCookie(req) ) {
        return next();
    }
    res.redirect('/login');
}

async function checkNotAuthenticated(req, res, next) {
    if (await checkCookie(req)){
        return res.redirect('/');
    }
    next();
}

module.exports=router;

/**
 * Method to check if a response contains a valid cookie
 */
async function checkCookie(req) {
    let check = false;
    await users.get().then(querySnapshot => {

    querySnapshot.forEach((doc) => {
        if(doc.id == req.cookies.uid) {
            check = true;
            }
        })
    })
    return check;
}
