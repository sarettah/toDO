const http = require('http'); //Now your application has access to the HTTP module, and is able to create a server
var fs = require('fs');
const express = require('express')
const app = express();
const { parse } = require('querystring');
const {MongoClient} = require('mongodb');
const router = express.Router();
const path = require('path');

//variabili e costanti
const hostname = '127.0.0.1';
const port = 3000;
const url = "mongodb+srv://sarah:sarah@cluster0.so4te.gcp.mongodb.net/ToDo?retryWrites=true&w=majority";
let db;
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
//app.use(express.static('public'));
app.use('/', router);

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


////////////////////////////////////////////////////////////////prima pagina//////////////////////////////////////////////////
router.get('/',function(req,res){
   res.sendFile(path.join(__dirname+'/login.html'));
   //__dirname : It will resolve to your project folder.
 });

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
                  console.log("result: nome "+nome+ " + id "+id);
                  const jsonUser = {id: id.toString(), nome:nome, email:email, password:password};
               
                  //res.sendFile(path.join(__dirname+'/home.html'));
                  
                  fs.readFile(path.join(__dirname+'/home.html'), function(err, data) {
                     if (err) throw err;
                     //res.writeHead(200, {'Content-Type': 'text/html'});
                     //res.send(JSON.stringify(jsonUser));
                     res.write(data);
                    // res.write(' <input type="hidden" id="id" name="id" value="'+id+'"> ');
                     res.write(' <input type="hidden" id="nome" name="nome" value="'+nome+'"> ')
                     //res.write(' <input type="hidden" id="email" name="email" value="'+email+'"> ')
                    // res.write(' <input type="hidden" id="password" name="password" value="'+password+'"> ')

                     

                    });
                  // res.writeContinue("");
                  //res.render("home", jsonUser);
                  //res.send(JSON.stringify(jsonUser));
                  
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
   res.sendFile(path.join(__dirname+'/register.html'));
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
               //_id: "1234",
               nome: nome,
               email: email,
               password: password
             })
             .then(function(result) {
               // process result
               console.log("query insert andata a buon fine");
               //console.log("chiudo connessione")
               //client.close();
               res.sendFile(path.join(__dirname+'/home.html'));
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




 