// npm i express <--- instalar antes.... express para criar e configurar o servidor
const express = require("express")
const server = express()

const db = require("./db")

/* const ideas = [{
    img:"https://image.flaticon.com/icons/svg/2729/2729007.svg",
    title:"Curso de Programaçao",
    category:"Estudo",
    description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem, reiciendis, ut mollitia aperiam voluptas aliquid laboriosam culp",
    url:"https://rocketseat.com.br"
},
{
    img:"https://image.flaticon.com/icons/svg/2729/2729005.svg",
    title:"Exercicios",
    category:"Saúde",
    description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem, reiciendis, ut mollitia aperiam voluptas aliquid laboriosam culp",
    url:"https://rocketseat.com.br"
},
{
    img:"https://image.flaticon.com/icons/svg/2729/2729027.svg",
    title:"Meditação",
    category:"Mentalidade",
    description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem, reiciendis, ut mollitia aperiam voluptas aliquid laboriosam culp",
    url:"https://rocketseat.com.br"
},
{
    img:"https://image.flaticon.com/icons/svg/2729/2729032.svg",
    title:"Karaokê",
    category:"Diversão em Família",
    description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem, reiciendis, ut mollitia aperiam voluptas aliquid laboriosam culp",
    url:"https://rocketseat.com.br"
}

] */


// configurar arquivos estaticos (css, scripts, imagens)
server.use(express.static("public"))

//habilitar o uso do  req.body

server.use(express.urlencoded({extended: true}))

// configuracao do nunjucks <--- serve para dinamizar o html
const nunjucks = require("nunjucks")
nunjucks.configure("views", {
    express: server,
    noCache: true,

})

// criei uma rota "/" (barra)
//e capturo o pedido do cliente para responder
server.get("/", function( req, res ) {

    db.all(`SELECT * FROM ideas`, function(err, rows) {
        if(err) {
            console.log(err)
            return res.send("Erro no banco de dados")
        }
        
        const reversedIdeas = [...rows].reverse()

    let lastIdeas = []
    for (let idea of reversedIdeas){
        if(lastIdeas.length < 2){
            lastIdeas.push(idea)
        }
    }


    return res.render("index.html", {ideas : lastIdeas})
    })

})

server.get("/ideias", function( req, res ) {

    req.query //? title=shuahu&category.... pega as requisiçoes vindas do usuario (front)

    db.all(`SELECT * FROM ideas`, function(err, rows) {
        if(err) {
            console.log(err)
            return res.send("Erro no banco de dados")
        }
        const reversedIdeas = [...rows].reverse()

        return res.render("ideias.html", {ideas : reversedIdeas})


    })


})

server.post("/", function(req, res){
        //INSERIR DADOS NA TABELA
    
     const query = `
        
        INSERT INTO ideas(
            image,
            title,
            category,
            description,
            link
        ) VALUES(?,?,?,?,?);
    
    `
    const values =  [
      req.body.image,
      req.body.title,
      req.body.category,
      req.body.description,
      req.body.link,
    ] 
     db.run(query, values, function(err){
        if(err) {
            console.log(err)
            return res.send("Erro no banco de dados")
        }

        return res.redirect("/ideias")
    }) 
    

})

// liguei meu servidor na porta 3000
server.listen(3000)