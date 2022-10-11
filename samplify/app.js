const express=require('express');
const http=require('http');
const path=require('path');
const parser=require('body-parser');
const app=express();

app.set('view engine', 'ejs');
app.set('views','views');

app.use(parser.urlencoded({extended:false}));
const routes = require('./routes/routes');
app.use(express.static(path.join(__dirname,'public')));
app.use('/',routes);
app.use((req,res)=>{res.send("cannot find page")});
server = http.createServer(app);
server.listen(3000, 'localhost');
