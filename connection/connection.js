//import { connect } from 'http2';

const {MongoClient} = require('mongodb');

//connection();

export function connection(){

   const uri = "mongodb+srv://sarah:sarah@cluster0.so4te.gcp.mongodb.net/ToDo?retryWrites=true&w=majority";
   const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

   connectToDB().catch(console.error)
   console.log("boh2")
   async function  connectToDB() {
      console.log("boh1")
      
      try {
          // Connect to the MongoDB cluster
          await client.connect();

          //console.log(client.isConnected)

      } catch (e) {
          console.error(e);
      } finally{
         console.log("boh")
      }
    }

   

}      



    /*async function main(){
      
      // * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
      // * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
       
      
      try {
          // Connect to the MongoDB cluster
          await client.connect();
          // Make the appropriate DB calls
          await  listDatabases(client);

      } catch (e) {
          console.error(e);
      } finally {
          await client.close();
      }
    }
*/
    //main().catch(console.error);

 /*   async function listDatabases(client){
      var databasesList = await client.db().admin().listDatabases();

      console.log("Databases:");
      databasesList.databases.forEach(db => console.log(` - ${db.name}`));
    };
*/
   

   

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