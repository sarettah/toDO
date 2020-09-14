const http = require('http'); //Now your application has access to the HTTP module, and is able to create a server
var fs = require('fs');
const express = require('express')
const app = express();
const { parse } = require('querystring');
const {MongoClient} = require('mongodb');
const router = express.Router();
const path = require('path');
const {ObjectId} = require('mongodb'); 

//import js
const functions = require('./public/javascripts/functions');

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
////////////////////////////////////////////////////////////home/////////////////////////////////////////////////////////
router.get('/home',function(req,res){
  res.sendFile(path.join(__dirname+'/public/home.html'));
  //__dirname : It will resolve to your project folder.
});

////////////////////////////////////////////////////////modifica ed elimina//////////////////////////////////////////////////
router.get('/modifica',function(req,res){
  var id = req.query.id;
  var titolo = req.query.titolo;
  var descrizione = req.query.descrizione;
  //console.log("modifica! "+id+" "+titolo+" "+descrizione);
  res.write('<script src="/javascripts/nav.js"></script>'+
  '<h3>modifica</h3>'+
  '<form action="/updateNota" method="POST">'+
  '<input type="hidden" id="id" name="id" value="'+id+'"'+
  '<label for="titolo">Titolo:</label>'+
  '<input type="text" id="titolo" name="titolo" value="'+titolo+'"><br><br>'+
  '<label for="descrizione">Descrizione:</label>'+
  '<input type="text" id="descrizione" name="descrizione" value="'+descrizione+'"><br><br>'+
  '<input type="submit" value="Salva">'+
  '</form>'
  );
res.end();
  //res.sendFile(path.join(__dirname+'/public/modifica.html'));
  //res.write("ok");
});
router.post('/updateNota', function(req, res){
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
    id=json.id;
    console.log("json  "+titolo + " + "+descrizione)
    functions.updateNota(id,titolo,descrizione,db,res);
    
  }); 
  //res.sendFile(path.join(__dirname+'/public/nuovo.html'));
 
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
    functions.addNewNota(titolo, descrizione,db, res);
  }); 
  //res.sendFile(path.join(__dirname+'/public/nuovo.html'));
 
});
/////////////////////////////////////////////////////////////per la lista////////////////////////////////////////////////

router.get('/lista', (req, res) =>{
  functions.findListaNote(db,res);    
});

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
      if(json.ischecked === true || json.ischecked === 'true'  )
        modifyNoteCheck(json.id, false, res)
      else
        modifyNoteCheck(json.id, true, res)
      
    });
    //res.end("ok")
    //modifyNoteCheck(res);
});
function modifyNoteCheck(idNota,ischecked, res){
  console.log("ischecked "+ischecked);
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
     functions.findUser(email, password,db, res);
    });  
 });



 ///////////////////////////////////////////////////////per la registrazione////////////////////////////////////////////////
router.get('/registrati', (req, res) => {
   res.sendFile(path.join(__dirname+'/public/register.html'));
   //console.log("click registrati server side");
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
    
     functions.addNewUser(nome, email, password, db, res);
   });
  
 });
 



 