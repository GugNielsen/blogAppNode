const express= require("express");
const router = express.Router();
const mongoose = require('mongoose');
require('../Models/Postagen');
const Postagen = mongoose.model('postagens')

router.get('/',(req,res)=>{

    res.render('postagen/postagens')
})

module.exports= router;