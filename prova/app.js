
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

const hostname = '127.0.0.1';
const port = 3000;
var d;
var adr = 'http://127.0.0.1:3000/default.htm?year=2017&month=february';
var q = url.parse(adr, true);

console.log(q.host); //returns 'localhost:8080'
console.log(q.pathname); //returns '/default.htm'
console.log(q.search); //returns '?year=2017&month=february'

var qdata = q.query; //returns an object: { year: 2017, month: 'february' }
console.log(qdata.month); //returns 'february'

//create a server object:
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html'); 
  res.write('Hello World!'); //write a response to the client
  res.write(req.url); //scrive la risposta (in quest caso è l'url)

  fs.readFile('prova/secondPage.html', function(err, data) {
   if (err) throw err;
   //res.writeHead(200, {'Content-Type': 'text/html'});
   //res.write(data);
   d=data;
  });

  res.write("questo è data: "+d);


  res.end(); //end the response

  
});

server.listen(port, hostname, () => { //the server object listens on port 3000
  console.log(`Server running at http://${hostname}:${port}/`);
});


