const { doc, getDoc, FieldValue } = require('firebase-admin/firestore');
const db=require('../firebase');
const users=db.collection('users');
const playlists=db.collection('playlists');

exports.getIndex = (req,res)=>{
    res.render('index',{'pageTitle':'Samplify'});
}

exports.getSearch = (req,res) =>{
    res.render('search',{'pageTitle':'Search'});
}

exports.getPlaylists = (req,res) => {
    res.render('playlists',{'pageTitle':'Playlists'});
}

exports.getProfile = (req,res) => {
    res.render('profile',{'name':'name', 'email':'email'});
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
            console.log(doc.id, " => ", doc.data().email);
            const result = bcrypt.compareSync(password, doc.data().password);
            if(doc.data().email === email && result) {
                res.cookie("uid", doc.id);
                console.log("cookie set");
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
        return res.redirect('/login');
    } catch {
        return res.redirect('/register');
    }
}

exports.getPlaylistsDynamic = async (req,res) => {
    const playshot = await playlists.where('user', '==', req.params.username).get();
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