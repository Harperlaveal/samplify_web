const path=require('path')
const express = require('express');
const router = express.Router();
const controller = require('../controller/controller');
const passport = require('passport');
const { FieldValue } = require('firebase-admin/firestore');

router.use(express.static(path.join(__dirname,'public')));

router.get('/search', checkAuthenticated, controller.getSearch);

router.get('/playlists', checkAuthenticated, controller.getPlaylists);

router.get('/profile', checkAuthenticated, controller.getProfile);

router.get('/login', checkNotAuthenticated, controller.getLogin);

router.get('/register', checkNotAuthenticated, controller.getSignin);

router.get('/', checkAuthenticated, controller.getIndex);

router.get('/playlists/:username', controller.getPlaylistsDynamic)

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

router.post('/playlists', async (req,res) => {
    try{
        await db.collection('playlists').doc('vhEoZID4puRVRui7fBfk').update({
            title: req.body.title,
            description: req.body.desc
        });
        
        res.redirect('/playlists');
    }
    catch{
        res.redirect('/login');
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
        console.log("authenticated");
        return next();
    }
    console.log("not authenticated");
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
            console.log("cookie found")
            check = true;
            }
        })
    })
    if(check === false) {
        console.log("cookie not found");
    }
    return check;
}
