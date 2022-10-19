const path=require('path')
const express = require('express');
const router = express.Router();
const controller = require('../controller/controller');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

router.get('/search', checkAuthenticated, controller.getSearch);

router.get('/playlists', checkAuthenticated, controller.getPlaylists);

router.get('/profile', checkAuthenticated, controller.getProfile);

router.get('/login', checkNotAuthenticated, controller.getLogin);

router.get('/register', checkNotAuthenticated, controller.getSignin);

router.get('/', controller.getIndex);

router.post('/search', () => {})

// router.post('/register', controller.postSignUp);

// router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/login',
//     failureFlash: true
//   }))

router.post('/login', (req,res) => {
    const email = req.body.email;
    const password = req.body.password;
    const usersSnapshot = users.get().then(querySnapshot => {
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data().email);
            const result = bcrypt.compareSync(password, doc.data().password);
            if(doc.data().email === email && result) {
                res.cookie("uid", doc.id);
                console.log("cookie set");
                res.send();
                return;
            }
        })
    })
});

const db=require('../firebase');
const users=db.collection('users');
const playlists=db.collection('playlists');

const initializePassport = require('./passport-config');
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

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
    if (checkCookie(req)) {
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
 * Method to check if a response contains a valid cookie
 */
async function checkCookie(req) {
    const usersSnapshot = users.get().then(querySnapshot => {
    querySnapshot.forEach((doc) => {
        if(doc.id == req.cookies.uid) {
            console.log("cookie found")
            return true;
        }
        })
    })
    return false;
}

// /**
//  * Check if the given email matches any in the users database, if so set the uid as a cookie
//  */
//  async function checkEmail(req, res) {
//     const email = req.body.email;
//     const usersSnapshot = users.get().then(querySnapshot => {
//         querySnapshot.forEach((doc) => {
//             console.log(doc.id, " => ", doc.data().email);
//             if(doc.data().email === email) {
//                 res.cookie(uid, doc.id);
//                 console.log("email match found");
//             }
//         })
//     })
    

//     return emailFound;
// }
