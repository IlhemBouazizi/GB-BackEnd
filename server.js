const express = require('express');
const app = express();
const cors = require("cors");

app.use(express.json());


var corsOptions = {
    //origin: "http://localhost:4200"
    origin: "*"
  };

app.use(cors(corsOptions));

// mettre le serveur à l'écoute(en marche) sur le port 85
app.listen(
    85,
    ()=>{console.log("Serveur Express a l ecoute sur le port 85");}
);

// connexion de notre serveur à la base mongo
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'gestibank';


let db 


MongoClient.connect(url, function(err, client) {
 console.log("Connexion réussi avec Mongo");
 db = client.db(dbName);
});


//******************* */  Les API Rest des Clients //******************* */

// Liste de tous les clients
app.get('/clients/list/', (req,res) => {
      db.collection('users').find({"role": "CLIENT"}).toArray(function(err, docs) {
          if (err) {
              console.log(err)
              throw err
          }
          res.status(200).json(docs)
        }) 
    })
    
// liste de tous les clients avec statut en attente
app.get('/clients/list/attente', (req,res) => {
          db.collection('users').find({"role": "CLIENT","statut":"ATTENTE"}).toArray(function(err, docs) {
              if (err) {
                  console.log(err)
                  throw err
              }
              res.status(200).json(docs)
            }) 
})

// liste de tous les clients avec statut validé
app.get('/clients/list/valide', (req,res) => {
      db.collection('users').find({"role": "CLIENT","statut":"VALIDE"}).toArray(function(err, docs) {
          if (err) {
              console.log(err)
              throw err
          }
          res.status(200).json(docs)
        }) 
})


// ajout d'un nouveau client
app.post('/clients/add/',  async (req,res) => {
      
       try {
              const newClient = req.body
              const addedClient = await db.collection('users').insertOne(newClient)
              res.status(200).json(addedClient)
          } catch (err) {
              console.log(err)
              throw err
          } 
    })

// ajout d'un nouveau agent
app.post('/agent/add/',  async (req,res) => {
      
    try {
           const newAgent = req.body
           const addedAgent = await db.collection('users').insertOne(newAgent)
           res.status(200).json(addedAgent)
       } catch (err) {
           console.log(err)
           throw err
       } 
 })
// récupérer tous les AGENTs 
app.get('/agent/list', (req,res) => {
    db.collection('users').find({"role": "AGENT"}).toArray(function(err, docs) {
        if (err) {
            console.log(err)
            throw err
        }
        res.status(200).json(docs)
      }) 
})
// récupérer un user  
    app.get('/users/:email', async (req,res) => {
         
          try { 
              const email = req.params.email
              const user = await db.collection('users').findOne({email})
              console.log(email)
              res.status(200).json(user)
          } catch (err) {
              console.log(err)
              throw err
          }
        })

      /*  
        app.post('/users/add/', async (req,res) => {
              try {
                  const equipeData = req.body
                  const equipe = await db.collection('users').insertOne(equipeData)
                  res.status(200).json(equipe)
              } catch (err) {
                  console.log(err)
                  throw err
              }
            })
    
    app.put('/users/:id', async (req,res) => {
                  try {
                      const id = parseInt(req.params.id)
                      const replacementEquipe = req.body
                      const equipe = await db.collection('user').replaceOne({id},replacementEquipe)
                      res.status(200).json(equipe)
                  } catch (err) {
                      console.log(err)
                      throw err
                  }
                })
    
    app.delete('/users/:id', async (req,res) => {
                      try {
                          const id = parseInt(req.params.id)
                          const equipe = await db.collection('user').deleteOne({id})
                          res.status(200).json(equipe)
                      } catch (err) {
                          console.log(err)
                          throw err
                      } 
                    })
*/
