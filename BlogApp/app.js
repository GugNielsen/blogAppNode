// caregando os modulos 
const express =require('express');
const mongoose = require('mongoose');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const a = require('./Routers/admin')
const admin = require('./Routers/admin')
const path = require('path');
const session = require('express-session');
const flah = require('connect-flash')

// secao
app.use(session({
    secret:'crusonode',
    resave:true,
    saveUninitialized:true
}));
app.use(flah());
// Middleware
 app.use((req,res,nest) =>{
     res.locals.success_mgs = req.flash("success_msg");
     res.locals.test_msg = req.flash("test_msg");
     res.locals.erro_msg = req.flash("erro_msg");
     nest();    
 })
// condiguraçoes
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//handlebars
app.engine('handlebars',handlebars({defaultLayout:'main'}));
app.set('view engine','handlebars');
// Mongosse
mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/blogappp',{
        useNewUrlParser:true,
        useUnifiedTopology: true}).then(()=>{
        console.log('Conectado ao Banco de dados');
    }).catch((erro)=>{
        console.log('Ocoreu um erro a se conectar com o banco ' + erro);
    })

//Public
app.use(express.static(path.join(__dirname,'public')))

// rotas
app.use('/admin',admin)


//outros
const Port = 1350
app.listen(Port,()=>{
    console.log('Servido rodando na Porta ' + Port);
})