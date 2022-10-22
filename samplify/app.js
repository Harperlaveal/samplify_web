if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express=require('express');
const http=require('http');
const path=require('path');
const app=express();
const routes = require('./routes/routes');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');

app.set('view engine', 'ejs');
app.set('views','views');
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use(flash());
app.use(session({
  name: "sid",
  secret: "secret",
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    path: '/',
    secure: false,
    maxAge: 1*240*1000,
    signed: false
  }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(express.static('public'))
app.use('/playlists/', express.static('public'));

app.use('/',routes);

app.use((req,res)=>{res.render("oops")});

app.listen(process.env.PORT || 3002, () => {
  console.log(`Server listening`);
});
