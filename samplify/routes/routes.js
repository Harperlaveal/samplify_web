const path=require('path')
const express = require('express');
const router = express.Router();
const controller = require('../controller/controller');
const passport = require('passport');
const { FieldValue } = require('firebase-admin/firestore');

router.use(express.static(path.join(__dirname,'public')));

router.get('/search', checkSessionID, checkAuthenticated, controller.getSearch);

router.get('/playlists', checkSessionID, checkAuthenticated, controller.getPlaylists);

router.get('/profile', checkSessionID, checkAuthenticated, controller.getProfile);

router.get('/login', checkNotAuthenticated, controller.getLogin);

router.get('/register', checkNotAuthenticated, controller.getSignin);

router.get('/', checkSessionID, checkAuthenticated, controller.getIndex);

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

router.post('/playlists', async (req,res) => {
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

/**
 * Method to check if session id exists
 */
async function checkSessionID(req, res, next) {
    let check = false;
    if(req.cookies.sid) {
        check = true;
    }
    if(check) {
        console.log("session ID found");
        next();

    } else {
        console.log("no session ID found");
        res.clearCookie("uid");
        return res.redirect('/');
    }
}