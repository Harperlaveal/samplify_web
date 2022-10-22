const path=require('path')
const express = require('express');
const router = express.Router();
const controller = require('../controller/controller');

const {OAuth2Client} = require('google-auth-library');
const { UserMetadata } = require('firebase-admin/lib/auth/user-record');
const CLIENT_ID = "611779178684-6k43d22p5teipami42c6m65297tbjmca.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

router.use(express.static(path.join(__dirname,'public')));

router.get('/search', controller.checkSessionID, controller.checkAuthenticated, controller.getSearch);

router.get('/not-search', controller.checkSessionID, controller.checkNotAuthenticated, controller.unauthSearch);

router.get('/playlists', controller.checkSessionID, controller.checkAuthenticated, controller.getPlaylists);

router.get('/profile', controller.checkSessionID, controller.checkAuthenticated, controller.getProfile);

router.get('/login', controller.checkNotAuthenticated, controller.getLogin);

router.get('/register', controller.checkNotAuthenticated, controller.getSignin);

router.get('/', controller.checkSessionID, controller.checkAuthenticated, controller.getSearch);

router.get('/playlists/:username', controller.getPlaylistsDynamic);

router.get('/json/:username', controller.getJson);

router.get('/signedOut', controller.getSignedOut);

router.post('/login/normal', controller.postLogin);

router.post('/login', controller.postGoogle);

router.post('/register', controller.checkNotAuthenticated, controller.postRegister);

router.post('/profile', controller.postSignout);

router.post('/search', controller.postSearch);

router.post('/json/:username', controller.postJson);

router.post('/playlists/edit', controller.postEditPlaylist);

router.post('/playlists/clear', controller.postClearPlaylist);

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
