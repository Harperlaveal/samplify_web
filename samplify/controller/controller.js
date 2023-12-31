const db=require('../firebase');
const users=db.collection('users');
const playlists=db.collection('playlists');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { FieldValue } = require('firebase-admin/firestore');
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = "611779178684-6k43d22p5teipami42c6m65297tbjmca.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

exports.getSearch = (req,res) =>{
    res.render('search');
}

exports.unauthSearch = (req,res) =>{
    res.render('not-search');
}

exports.getPlaylists = async (req,res) => {
    try{
        const userdoc = await users.doc(req.cookies.uid).get();
        const plid = userdoc.data().plid;
        const playdoc = await playlists.doc(plid).get();
        var samples = playdoc.data().samples;
        var title = playdoc.data().title;
        var desc = playdoc.data().description;

        res.render('playlists',{'samples':samples, 'title':title, 'desc': desc});
    }
    catch{
        res.redirect('/');
    }
}

exports.getPlaylistsDynamic = async (req,res) => {
    const playshot = await playlists.where('name', '==', req.params.username).get();
    var title = "title";
    var desc= "desc";
    var samples = [];

    if(!playshot.empty){
        playshot.forEach(doc => {
            title = doc.data().title;
            desc= doc.data().description;
            samples = doc.data().samples;
        });
        res.render('dynamic-list',{'samples': samples, 'username':req.params.username,'title':title, 'description':desc});
    }
    else{
        res.redirect('/search');
    }
}

exports.getJson = async (req,res) => {
    const playshot = await playlists.where('name', '==', req.params.username).get();
    var title = "title";
    var desc= "desc";
    var samples = [];
    if(!playshot.empty){
        playshot.forEach(doc => {
            title = doc.data().title;
            desc= doc.data().description;
            samples = doc.data().samples;
        });
        let playlist = {
            title: title,
            desc: desc,
            samples: samples
        }
        res.status(200).json(playlist);
    }
}

exports.getProfile = async (req,res) => {
    try{
        const userdoc = await users.doc(req.cookies.uid).get();
        var name = userdoc.data().name;
        var email = userdoc.data().email;
        res.render('profile',{'name':name, 'email':email}); 
    }
    catch{
        res.redirect('/');
    }
}

exports.getLogin = (req,res) => {
    res.render('login',{'pageTitle':'Login'});
}

exports.getSignin = (req,res) => {
    res.render('register',{'bad':false});
}

exports.getSignedOut = (req, res) => {
    res.render('signedOut',{'pageTitle':'SignedOut'});
}

exports.postLogin = async (req,res) => {
    const email = req.body.email;
    const password = req.body.password;
    await users.get().then(querySnapshot => {
        querySnapshot.forEach((doc) => {
            const result = bcrypt.compareSync(password, doc.data().password);
            if(doc.data().email === email && result) {
                res.cookie("uid", doc.id, {expires: new Date(Date.now() + 172800000)}); // cookie will expire after 2 days
            }
        })
        res.redirect('/'); // will redirect to login if login fails 
        res.send();
        return;
    })
}

exports.postRegister = async (req,res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const userid = uuidv4().replace(/-/g, "");
        const plid = uuidv4().replace(/-/g, "");

        if (req.body.password.length < 8) {
            return res.render('register',{'bad':true});
        }
        else {
            await users.doc(userid).set({
                name: req.body.username,
                email: req.body.email,
                password: hashedPassword,
                plid: plid,
            });
            const  userdoc = await users.doc(userid).get();
    
            await playlists.doc(plid).set({
                title: '',
                description: '',
                name: userdoc.data().name,
                userid: userid,
                samples: [],
            });
            return res.redirect('/login');
        }
        
    } catch {
        return res.redirect('/register');
    }
}

exports.postSignout = async (req,res, next) => {
    console.log("signing out");
    res.clearCookie("uid");
    res.redirect('/');
}

exports.getPlaylistsDynamic = async (req,res) => {
    const playshot = await playlists.where('name', '==', req.params.username).get();
    var title = "title";
    var desc= "desc";
    var samples = [];

    if(!playshot.empty){
        playshot.forEach(doc => {
            title = doc.data().title;
            desc= doc.data().description;
            samples = doc.data().samples;
        });
    
        res.render('dynamic-list',{'samples': samples, 'username':req.params.username,'title':title, 'description':desc});
    }
    else{
        res.redirect('/oops');
    }

    
}

exports.postSearch = async (req,res) => {
    try{
        const userdoc = await users.doc(req.cookies.uid).get();
        const plid = userdoc.data().plid;

        let sampleJSON = req.body.samples;

        let selected = JSON.parse(sampleJSON);

        selected.map(async (sample)=>{
            await db.collection('playlists').doc(plid).update({
                samples: FieldValue.arrayUnion(sample),
           });
        })
        res.redirect('/playlists');
    }
    catch{
        res.redirect('/');
    }
}

exports.postJson = async (req,res) => {
    try{
        const userdoc = await users.doc(req.body.uid).get();
        const plid = userdoc.data().plid;
        await db.collection('playlists').doc(plid).update({
            title: req.body.title,
            description: req.body.desc
        });
        res.status(201).json({ status: 'updating', message: 'tried to update data' });
    } catch {
        res.status(401).json({ status: 'failure', message: 'Data Not Added.' });
    }
}

exports.postEditPlaylist = async (req,res) => {
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
}

exports.postClearPlaylist = async (req,res) => {
    try{
        const userdoc = await users.doc(req.cookies.uid).get();
        const plid = userdoc.data().plid;

        let idJSON = req.body.remove;

        let selected = JSON.parse(idJSON);

        let samples = (await db.collection('playlists').doc(plid).get()).data().samples;

        for (let i = selected.length - 1; i >= 0; i--) {
            for (let j = samples.length - 1; j >= 0; j--) {
                if (selected[i] == samples[j].id) { 
                    samples.splice(j,1);
                 }
            }
        }

        await db.collection('playlists').doc(plid).update({
            samples: samples
        });

        res.redirect('/playlists');
    }
    catch{
        res.redirect('/');
    }
}

exports.checkAuthenticated = async (req, res, next) => {
    if (await checkCookie(req) ) {
        return next();
    }
    res.redirect('/login');
}

exports.checkNotAuthenticated = async (req, res, next) => {
    if (await checkCookie(req)){
        return res.redirect('/');
    }
    next();
}

exports.postGoogle = async (req, res)=>{
    let token = req.body.token;
    let user = {};
    console.log(token);
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
      }
      verify()
      .then(() => {
          res.cookie('session-token', token);
          res.send('success');
      }).
      catch();
}

/**
 * Method to check if session id exists
 */
 exports.checkSessionID = async(req, res, next) => {
    let check = false;
    if(req.cookies.sid) {
        check = true;
    }
    if(check) {
        next();

    } else {
        res.clearCookie("uid");
        return res.redirect('/signedOut');
    }
}

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