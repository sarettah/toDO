const http = require('http'); //Now your application has access to the HTTP module, and is able to create a server
var fs = require('fs');
const express = require('express')
const app = express();
const { parse } = require('querystring');
const {MongoClient} = require('mongodb');
const router = express.Router();
const path = require('path');
const {ObjectId} = require('mongodb'); 

//variabili e costanti
const hostname = '127.0.0.1';
const port = 3000;
const url = "mongodb+srv://sarah:sarah@cluster0.so4te.gcp.mongodb.net/ToDo?retryWrites=true&w=majority";
let db;
var currentUser = {};
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(express.static(path.join(__dirname, 'public')));
app.use("/styles", express.static(__dirname + '/public/stylesheets'));
app.use("/scripts", express.static(__dirname + '/public/javascripts'));
app.use("/images", express.static(__dirname + '/public/images'));
app.use('/', router);
app.use(express.urlencoded());
app.use(express.json());

// connect to the db and start the express server
client.connect().then(function(){
   console.log('Apro connessione');
   db = client.db("ToDo");
   // start the express web server listening on localhost:3000
   app.listen(port, () => {
      console.log('listening on '+ hostname+':'+port);
    });
}).catch(err => {
   console.log("errore: "+err);
});


////////////////////////////////////////////////////////////////prima pagina//////////////////////////////////////////////
router.get('/',function(req,res){
   res.sendFile(path.join(__dirname+'/public/login.html'));
   //__dirname : It will resolve to your project folder.
 });


///////////////////////////////////////////////////////////////nuova nota//////////////////////////////////////////////////
router.get('/nuovo', function(req, res){
  res.sendFile(path.join(__dirname+'/public/nuovo.html'));
  
});
router.post('/newNota', function(req, res){
  var body="";
  req.on('data', chunk => {
    body += chunk.toString(); // convert Buffer to string
  });
  req.on('end', () => {
    //console.log("body  "+body);
    var json = parse(body)
    console.log("json: "+JSON.stringify(json))
    titolo = json.titolo;
    descrizione = json.descrizione;
    console.log("json  "+titolo + " + "+descrizione)
    addNewNota(titolo, descrizione, res);
  }); 
  //res.sendFile(path.join(__dirname+'/public/nuovo.html'));
 
});
function addNewNota(titolo, descrizione, res){
  if(titolo === null || titolo === "")
    res.end("bisogna inserire il titolo");
  db.collection('note').insertOne({
      titolo: titolo,
      idUser: currentUser.id,
      note: descrizione,
      checked: false
    }).then(function(){
      res.redirect('/lista');
    });
  
  
}

/////////////////////////////////////////////////////////////per la lista////////////////////////////////////////////////

router.get('/lista', (req, res) =>{
  findListaNote(res);    
});

const findListaNote =(res) =>{
  try {          
    console.log("cerco lista note in db dell'utente con id "+currentUser.id.toString());
    const query = {  idUser: currentUser.id.toString() };
    //const projection = { _id: 1, nome: 1 };
    db.collection('note').find(query )
    .toArray(function(err, result) {
      if (err) throw err;
      console.log("result: "+result);
      var note = [] = result;
      fs.readFile(path.join(__dirname+'/public/lista.html'), function(err, data) {
        if (err) throw err;
        res.write(data);
        if(note !== null && note.length >0){
          
          for(var i = 0; i<note.length; i++){
            //var nota = result[i];
            var check = "";
            if(result[i].checked){
              check='<input type="checkbox" id="'+result[i]._id.toString()+'" onclick="check(\' '+result[i]._id.toString()+' \', \'true\' )" checked>'
            }else{
              check='<input type="checkbox" id="'+result[i]._id.toString()+'" onclick="check(\' '+result[i]._id.toString()+' \', \'false\')" >'
            }
            res.write('<p>'+
            '<br> Titolo:      '+result[i].titolo+
            '<br> descrizione: '+result[i].note+
            '<br> fatto:'+check+
            '</p>');
          }
          res.end();
  
        }else{
          res.end("non hai ancora note salvate");
        }
        
       });

    });
  } catch (e) {
      console.error(e);
  } 
}
/////////////////////////////////////////////////quando clicco una checkbox//////////////////////////////////////////
router.post('/check', function(req, res){
  
   var body="";
    req.on('data', chunk => {
      body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {
      //console.log("body  "+body);
      var json = JSON.parse(body)
      console.log("body  "+json.id+ " "+json.ischecked);
      if(json.ischecked === true)
        modifyNoteCheck(json.id, false, res)
      else
        modifyNoteCheck(json.id, true, res)
      
    });
    //res.end("ok")
    //modifyNoteCheck(res);
});
function modifyNoteCheck(idNota,ischecked, res){
  console.log("ischecked"+ischecked);
   db.collection('note').updateOne(
    { _id:ObjectId(idNota.trim()) },
    {
      $set: { 'checked': ischecked },
      $currentDate: { lastModified: true }
    }
  ).then(function(){
      res.end("ok");
      
  });
  
}

 ///////////////////////////////////////////////////////////per il login/////////////////////////////////////////////////////
 router.post('/login',function(req,res){

   let body = "";
   var json =null;
   var email="";
   var password="";
   req.on('data', chunk => {
       body += chunk.toString(); // convert Buffer to string
   });
   req.on('end', () => {
     //console.log("body  "+body);
     json = parse(body)
     email = json.email;
     password = json.password;
     console.log("json  "+email + " + "+password)
     findUser(email, password, res);
    });  
 });
 async function findUser( email, password, res) {
   if(email !==null && email !== "" && password !==null && password !== ""){
         console.log("campi validi")
         try {          
             console.log("cerco user in db");
             const query = {  email: email, password: password };
             const projection = { _id: 1, nome: 1 };
             db.collection('users').find(query, { projection: projection } )
             .toArray(function(err, result) {
               if (err) throw err;
               //console.log(result[0])
               if(typeof result[0] === 'undefined' ){
                  res.end("non ho trovato l'utente")
                  console.log("non ho trovato l'utente")
               }else{
                  var id = result[0]._id;
                  var nome = result[0].nome//result.projection.nome;
                  //console.log("result: nome "+nome+ " + id "+id);
                  currentUser = {id: id.toString(), nome:nome, email:email, password:password};
                 console.log("currentUser: "+ JSON.stringify(currentUser));
                  /*fs.readFile(path.join(__dirname+'/public/home.html'), function(err, data) {
                    if (err) throw err;
                    //res.write('<p>Ciao '+nome+'</p>');
                    res.write(data);
                    res.end();
                   });*/
                  res.sendFile(path.join(__dirname+'/public/home.html'));
                            
               }
              
            })
            
     
         } catch (e) {
             console.error(e);
         } 
   }else{
      res.send("email o password vuoti")
   }
}




 ///////////////////////////////////////////////////////per la registrazione////////////////////////////////////////////////
router.get('/registrati', (req, res) => {
   res.sendFile(path.join(__dirname+'/public/register.html'));
   console.log("click registrati server side");
  
 });

 router.post('/newUser', (req, res) => {
   //res.sendFile(path.join(__dirname+'/register.html'));
   console.log("click newUser server side ");
   let body = "";
   var json =null;
   var nome="";
   var email="";
   var password="";
   req.on('data', chunk => {
       body += chunk.toString(); // convert Buffer to string
   });
   req.on('end', () => {
     //console.log("body  "+body);
     json = parse(body)
     nome = json.nome;
     email = json.email;
     password = json.password;
     
     console.log("json  "+nome+" + "+email + " + "+password);
     //res.end('ok');
    
     addNewUser(nome, email, password, res);
   });
  
 });
 async function addNewUser(nome, email, password, res) {
   if(nome !==null && nome !== "" && email !==null && email !== "" && password !==null && password !== ""){
         console.log("campi validi")
         try {          
             console.log("aggiungo dati in db");
             db.collection('users').insertOne({
               nome: nome,
               email: email,
               password: password
             })
             .then(function(result) {
               // process result
               console.log("query insert andata a buon fine");
               //console.log("chiudo connessione")
               //client.close();
               res.sendFile(path.join(__dirname+'/public/home.html'));
             }).catch(function(err){
               console.log("errore: "+err)
             })
     
         } catch (e) {
             console.error(e);
         } 
   }else{
      res.send("uno o più campi vuoti vuoti")
   }
}




 