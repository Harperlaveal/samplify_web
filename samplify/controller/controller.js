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
    res.render('profile');
}

exports.getLogin = (req,res) => {
    res.render('login',{'pageTitle':'Login'});
}

exports.getSignin = (req,res) => {
    res.render('register',{'pageTitle':'Signin'});
}

exports.getPlaylistsDynamic = (req,res) => {
    const pid = req.params.pid;
    console.log(pid);
    //res.render('playlists',{'user':playlists.search(pid)})
}