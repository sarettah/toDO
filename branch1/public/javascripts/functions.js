const path = require('path');
var fs = require('fs');
const {ObjectId} = require('mongodb'); 

 async function addNewUser(nome, email, password, db, res) {
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
               res.sendFile(path.join('c:/Users/Consoft/Desktop/Progetti Personali Sarah/toDO/branch1/public/home.html'));
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

async function findUser( email, password, db, res) {
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
                  res.sendFile(path.join('c:/Users/Consoft/Desktop/Progetti Personali Sarah/toDO/branch1/public/home.html'));
                            
               }
            })
         } catch (e) {
             console.error(e);
         } 
   }else{
      res.send("email o password vuoti")
   }
}
function findListaNote(db, res){
   try {          
     console.log("cerco lista note in db dell'utente con id "+currentUser.id.toString());
     const query = {  idUser: currentUser.id.toString() };
     //const projection = { _id: 1, nome: 1 };
     db.collection('note').find(query )
     .toArray(function(err, result) {
       if (err) throw err;
       console.log("result: "+result);
       var note = [] = result;
       fs.readFile(path.join('c:/Users/Consoft/Desktop/Progetti Personali Sarah/toDO/branch1/public/lista.html'), function(err, data) {
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
             '<br>'+
             '<button><a href="modifica?id='+result[i]._id.toString()+'&titolo='+result[i].titolo+'&descrizione='+result[i].note+'" >modifica</a></button>'+
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
 function addNewNota(titolo, descrizione,db, res){
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

 function updateNota(id,titolo,descrizione,db, res){
  // console.log("ischecked "+ischecked);
  if(titolo === null || titolo === ""){
     res.end("il titolo deve essere valorizzato!");
  }else{
     db.collection('note').updateOne(
     { _id:ObjectId(id.trim()) },
     {
       $set: { 'titolo': titolo, 'note':descrizione },
       $currentDate: { lastModified: true }
     }).then(function(){
      res.redirect('/lista');
      });
  }
}

module.exports.addNewUser = addNewUser;
module.exports.findUser = findUser;
module.exports.findListaNote = findListaNote;
module.exports.addNewNota = addNewNota;
module.exports.updateNota = updateNota;