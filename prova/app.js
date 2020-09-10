
//To include a module, use the require() function with the name of the module

const http = require('http'); //Now your application has access to the HTTP module, and is able to create a server
var url = require('url');
var fs = require('fs'); //To include the File System module, use the require() method

/*method of object fs: 
Read files
Create files
Update files
Delete files
Rename files */
const express = require('express')
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.listen(8000, () => {
  console.log('Example app listening on port 8000!')
});



const hostname = '127.0.0.1';
const port = 3000;
var d;
var adr = 'http://127.0.0.1:3000/default.htm?year=2017&month=february';
var q = url.parse(adr, true);

//console.log(q.host); //returns 'localhost:8080'
//console.log(q.pathname); //returns '/default.htm'
//console.log(q.search); //returns '?year=2017&month=february'

var qdata = q.query; //returns an object: { year: 2017, month: 'february' }
//console.log(qdata.month); //returns 'february'

//create a server object:
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  
  const { headers, method, url } = req;
  let body = [];
  req.on('error', (err) => {
    console.error(err);
    console.log("error: "+err);
  }).on('data', (chunk) => {
    body.push(chunk);
    console.log("chunck: "+chunk);
    console.log("body: "+body);
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    console.log("end: "+body);
    // At this point, we have the headers, method, url and body, and can now
    // do whatever we need to in order to respond to this request.

    //response
    res.on('error', (err) => {
      console.error(err);
    });
   // res.writeHead(200, {'Content-Type': 'application/json'})
    const responseBody = { headers, method, url, body };
    res.end(JSON.stringify(responseBody))
    // END OF NEW STUFF
    
  });



  res.setHeader('Content-Type', 'text/html'); 
  res.write('Hello World!'); //write a response to the client
  res.write(req.url); //scrive la risposta (in quest caso è l'url)

  fs.readFile('prova/secondPage.html', function(err, data) {
   if (err) throw err;
   //res.writeHead(200, {'Content-Type': 'text/html'});
   //res.write(data);
   d=data;
  });

  res.write("questo prova/secondPage.html: "+d);


  res.end(); //end the response

  
});

server.listen(port, hostname, () => { //the server object listens on port 3000
  console.log(`Server running at http://${hostname}:${port}/`);
});


