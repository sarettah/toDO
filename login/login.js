/*
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://sarah:sarah@cluster0.so4te.gcp.mongodb.net/ToDo?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  
  // perform actions on the collection object
  client.close();
});
*/
//require
const http = require('http'); //Now your application has access to the HTTP module, and is able to create a server
var fs = require('fs');
const express = require('express')
const app = express();
const { parse } = require('querystring');
const {MongoClient} = require('mongodb');

//variabili e costanti
const hostname = '127.0.0.1';
const port = 3000;
var d;
const uri = "mongodb+srv://sarah:sarah@cluster0.so4te.gcp.mongodb.net/ToDo?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


//create a server object:
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html'); 

  if(req.method === null || req.method === ''){
    console.log("method empty or null")
  }
  else if (req.method === 'POST'){
    console.log("POST")
    //console.log(`post + ${req}`+req.url)
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
      res.end('ok');

      aggiungiInDb(email, password);
     
  });

  
  
  }else if (req.method === 'GET'){ 
    /*console.log(`get + ${req} + `+req.url)
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
    });
    console.log("body: "+body)
    req.on('end', () => {
      console.log("email "+body);
      res.end('ok');
  });*/
  }else{
    console.log("boh")
  }

  //async
  fs.readFile('login/login.html', function(err, data) {
   if (err) throw err;
   //res.writeHead(200, {'Content-Type': 'text/html'});
   //res.write(data);
   d=data;
  });
  
  res.write("questo login: "+d);
  /*res.write('<form action="/login"  method="GET">  '+ 
 ' <label for="email">Email:</label> '+
 ' <input type="text" id="email" name="email"><br><br>  '+
 ' <label for="password">Password:</label>  '+
 ' <input type="password" id="password" name="password"><br><br>  '+
 ' <input type="submit" value="login">  '+
 ' </form> '
);*/

  res.end(); //end the response


})



server.listen(port, hostname, () => { //the server object listens on port 3000
  console.log(`Server running at http://${hostname}:${port}/`);
});



async function aggiungiInDb(email, password) {
  if(email !==null && email !== "" && password !==null && password !== ""){
    console.log("campi validi")
    try {
      console.log("apro connessione")
      // Connect to the MongoDB cluster
      client.connect().then(function(){

        const db = client.db("ToDo");
        console.log("aggiungo dati in db");
        db.collection('users').insertOne({
          //_id: "1234",
          nome: "sarah",
          email: email,
          password: password
        })
        .then(function(result) {
          // process result
          console.log("query insert andata a buon fine");
          console.log("chiudo connessione")
          client.close();

        }).catch(function(err){
          console.log("errore: "+err)
        })


      })
    } catch (e) {
        console.error(e);
    } 
  }
}

