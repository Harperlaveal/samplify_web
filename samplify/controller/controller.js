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