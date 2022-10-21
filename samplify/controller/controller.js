const db=require('../firebase');
const users=db.collection('users');
const playlists=db.collection('playlists');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

exports.getIndex = (req,res)=>{
    res.render('index',{'pageTitle':'Samplify'});
}

exports.getSearch = (req,res) =>{
    res.render('search',{'pageTitle':'Search'});
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
    res.render('register',{'pageTitle':'Signin'});
}

exports.postLogin = async (req,res) => {
    const email = req.body.email;
    const password = req.body.password;
    await users.get().then(querySnapshot => {
        querySnapshot.forEach((doc) => {
            const result = bcrypt.compareSync(password, doc.data().password);
            if(doc.data().email === email && result) {
                res.cookie("uid", doc.id, {expires: new Date(Date.now() + 172800000)}); // cookie will expire after 2 days
                res.redirect('/');
                res.send();
                return;
            }
        })
    })
}

exports.postRegister = async (req,res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const userid = uuidv4().replace(/-/g, "");
        const plid = uuidv4().replace(/-/g, "");

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
        res.redirect('/search');
    }

    
}