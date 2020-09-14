const path = require('path');

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

module.exports.addNewUser = addNewUser;
module.exports.findUser = findUser;