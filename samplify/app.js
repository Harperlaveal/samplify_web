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

app.set('view engine', 'ejs');
app.set('views','views');
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));

app.use('/',routes);

app.use((req,res)=>{res.send("cannot find page")});
server = http.createServer(app);
server.listen(3000, 'localhost');
