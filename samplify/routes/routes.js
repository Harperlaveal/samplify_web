const path=require('path')
const express = require('express');
const router = express.Router();
const controller = require('../controller/controller');
const passport = require('passport');
const bcrypt = require('bcrypt');

router.get('/search', checkAuthenticated, controller.getSearch);

router.get('/playlists', checkAuthenticated, controller.getPlaylists);

router.get('/profile', checkAuthenticated, controller.getProfile);

router.get('/login', checkAuthenticated, controller.getLogin);

router.get('/register', checkAuthenticated, controller.getSignin);

router.get('/', checkAuthenticated, controller.getIndex);

// router.post('/register', controller.postSignUp);

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }))

// router.post('/login', controller.postLogin);

const users=require('../firebase');
const { getDocs } = require("firebase/firestore");

const initializePassport = require('./passport-config');
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

router.post('/register', checkNotAuthenticated, async (req,res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await users.add({
            name: req.body.username,
            email: req.body.email,
            password: hashedPassword,
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
    if (checkEmail(req)) {
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

/**
 * Check if the given email matches any in the users database, if so set the uid as a cookie
 */
 async function checkEmail(req) {
    const email = req.body.email;
    let emailFound = false;
    const usersSnapshot = await getDocs(users);
    usersSnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data().email);
        if(doc.data().email === email) {
            //setCookie("uid", doc.id, 3);
            emailFound = true;
        }
    })

    return emailFound;
}
