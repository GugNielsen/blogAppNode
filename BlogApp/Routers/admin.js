const express= require("express");
const router = express.Router();
const mongoose = require('mongoose');
require('../Models/Categoria');
const Categoria = mongoose.model('categorias');
require('../Models/Postagen');
const Postagem = mongoose.model('postagens');

router.get('/',(req,res) =>{
    //res.send('Pagina Princial do Painel de Adm');
    res.render('admin/index');
    //res.render('postagen/postagens')
})


router.get('/post', (req,res) =>{
    res.send('Pagina de Post');
})

router.get('/cat', (req,res) =>{
    Categoria.find().sort({date:'desc'}).then((categorias) =>
    {
        res.render('admin/categoria',({categorias:categorias}));
    }).catch((erro)=>{
        req.flash('erro_msg',"Ocoreu um erro ao Listar as categorias");
        res.redirect('admin');
    })
    
})

router.get('/cat/add', (req,res) =>{
    //res.render('admin/add');
    res.render('admin/add');
})

router.post('/cat/nova',(req,res)=>{
   var erro = []

   if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
       erro.push({texto:"Nome Invalido"});
   }
   if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
    erro.push({texto:"Slug Invalido"});
    }
    if(req.body.nome.length<2){
        erro.push({texto:"Nome da categoria muito pequeno"});
    }

    if(req.body.slug.length<2){ 
        erro.push({texto:"Slug da categoria muito pequeno"});
    }
   
    if(erro.length>0){
        res.render("admin/add",{erro:erro});
    }
    else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
       
        new Categoria(novaCategoria).save().then(()=>
        {
          req.flash("test_msg","Categoria Salva Com Sucesso");
           res.redirect('/admin/cat');
        }).catch((erro) =>
        {
            req.flash("erro_msg","erro do Banco de dados");
            res.redirect('/admin');
        })

    }
       
    })

router.get('/cat/edite/:id',(req,res)=>{
    Categoria.findOne({_id:req.params.id}).then((categoria)=>{
        res.render('admin/edite',{categoria:categoria});
    }).catch((erro) =>{
        req.flash("erro_msg","Categoria não encontrada");
        res.redirect('/admin/cat');
    })
    
})

router.post('/cat/edite',(req,res)=>{

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erro.push({texto:"Nome Invalido"});
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
     erro.push({texto:"Slug Invalido"});
     }
     if(req.body.nome.length<2){
         erro.push({texto:"Nome da categoria muito pequeno"});
     }
 
     if(req.body.slug.length<2){ 
         erro.push({texto:"Slug da categoria muito pequeno"});
     }
    
     if(erro.length>0){
         res.render("admin/edite",{erro:erro});
     }
     else{
        Categoria.findOne({_id:req.body.id}).then((categoria)=>{
            categoria.nome =req.body.nome;
            categoria.slug = req.body.slug;
            categoria.save().then(()=>{
                req.flash("test_msg","Categoria atualizada com Sucesso");
                res.redirect('/admin/cat');
            }).catch((err)=>{
                req.flash("erro_msg","Hove um erro interno ao salvar a categoria");
                res.redirect('/admin/cat');
            })
        }).catch((err)=>{
            req.flash("erro_msg","Hove um erro ao editar a categoria");
            res.redirect('/admin/cat');
        })
     }
})

router.post('/cat/del',(req,res)=>{
    Categoria.remove({_id:req.body.id}).then(()=>{
        req.flash('test_msg','Categoria Deletada Com Sucesso')
        res.redirect('/admin/cat');
    }).catch((erro)=>{
        req.flash('erro_msg','Erro ao deletar a Categoria')
        res.redirect('/admin/cat');
    })
})

router.get("/postagem",(req,res)=>{
    Postagem.find().then((postagens)=>{
        res.render("admin/postagem/postagem",{postagens:postagens})
    })
   // res.render("admin/postagem/postagem");
})

router.get("/postagem/addpostagem",(req,res)=>{
    Categoria.find().then((categorias)=>{
    res.render('admin/postagem/addpostagem',{categorias:categorias});
    }).catch(()=>{
                req.flash("erro_msg","erro ao adicionar categoria");
                res.redirect('/admin');
            })

})

router.post('/postagem/nova',(req,res)=>{
    var erro = []
    console.log(req.body.titulo);
    if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null){
      erro.push({texto:"Titulo Invalido"});
   } 
   if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erro.push({texto:"Slug Invalido"});
    }  
    if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){
        erro.push({texto:"Descricao tem esta preenchencida"});
    }
     if(!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null){
                erro.push({texto:"Conteudo tem esta preenchido"});
   }
   if(req.body.categoria == 0 ){
            erro.push({texto:"Categoria Invalida, registre uma Categoria"});
        }
       
    if(erro.length>0){
             res.render('admin/cat',{erro:erro});
         }

   else{
       const novaPostagen ={
           titulo: req.body.titulo,
           slug: req.body.slug,
           conteudo: req.body.conteudo,
           descricao: req.body.descricao,
           categoria: req.body.categoria
       }
       new Postagem(novaPostagen).save().then(()=>{
        req.flash("teste_msg","Postagem Criado Com Sucesso");
        res.redirect("/admin/postagem/postagem");      
       }).catch((err)=>{
        req.flash("erro_msg","erro ao Cria a Postagen");
        res.redirect("/admin/postagens");
       })
   }
})

router.post("/validate",(req,res)=>{
    const novaPostagen ={
        titulo: req.body.titulo,
        slug: req.body.slug,
        conteudo: req.body.conteudo,
        descrption: req.body.descrption,
        categoria: req.body.categoria
    }
    new Postagem(novaPostagen).save().then(()=>{
     req.flash("test_msg","Postagem Criado Com Sucesso");
     res.redirect("/admin/postagem");      
    }).catch((err)=>{
     req.flash("erro_msg","erro ao Cria a Postagen " + err);
     res.redirect("/admin/postagem");
    })

})
// router.post("/postagens/nova",(req,res)=>{
//     var erro = []

//     if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null){
//         erro.push({texto:"Titulo Invalido"});
//     }
//     if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
//      erro.push({texto:"Slug Invalido"});
//      }
//      if(req.body.slug.length<2){ 
//          erro.push({texto:"Slug da categoria muito pequeno"});
//      }
//      if(req.body.categoria == 0 ){
//         erro.push({texto:"Categoria Invalida, registre uma Categoria"});
//     }
//    
    
//     //  if(erro.length>0){
//     //      res.render('/admin/cat',{erro:erro});
//     //  }
//      else{
//         const novaPostagen = {
//             titulo: req.body.titulo,
//             slug:req.body.slug,
//             descricao:req.body.descricao,
//             conteudo:req.body.conteudo,
//             categoria:req.body.conteudo
           
//         }
//         new Postagem(novaPostagen).save().then(()=>{
//             req.flash("teste_msg","Postagem Criado Com Sucesso");
//             rres.redirect("/admin/postagens");
    
//         }).catch(()=>{
//             req.flash("erro_msg","erro ao Cria a Postagen");
//             res.redirect("/admin/postagens");
//         })
//      }

    
// })


module.exports= router;