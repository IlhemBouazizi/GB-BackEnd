const express = require('express');
const app = express();
const cors = require("cors");

app.use(express.json());

var nodemailer = require('nodemailer');


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

              var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'ilhem.bouazizi@gmail.com',
                  pass: 'assouyassou'
                }
              });
            var mailOptions = {
              from: 'ilhem.bouazizi@gmail.com',
              // Get the email from the request
              to: req.body.email,
              subject: 'Validation de création de nouveau compte client GestiBank',
              text: 'Félicitations votre compte a été crée avec succès, Login : '+ req.body.email +" Votre mot de passe :"+req.body.password
            };
          
            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });

        
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
           var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'ilhem.bouazizi@gmail.com',
              pass: 'assouyassou'
            }
          });
        var mailOptions = {
          from: 'ilhem.bouazizi@gmail.com',
          // Get the email from the request
          to: req.body.email,
          subject: 'Validation de création de compte agent GestiBank',
          text: 'Félicitations votre compte a été crée avec succès, Login : '+ req.body.email +", Votre mot de passe :"+req.body.password+", Votre matricule :"+req.body.matricule
        };
      
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });


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
    app.get('/clients/:email', async (req,res) => {
         
          try { 
              const email = req.params.email
              const user = await db.collection('users').findOne({email})
              //console.log(email)
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
    */
   //supprimer un agent
    app.delete('/agent/:mail', async (req,res) => {
                      try {
                          const mail = parseInt(req.params.id)
                          const agent = await db.collection('users').deleteOne({mail})
                          res.status(200).json(agent)
                      } catch (err) {
                          console.log(err)
                          throw err
                      } 
                    })

        //modifier un agent
        app.put('/agent/:mail', async (req,res) => {
            try {
                const mail = parseInt(req.params.id)
                const replacementAgent = req.body
                const agent = await db.collection('users').replaceOne({id},replacementAgent)
                res.status(200).json(agent)
            } catch (err) {
                console.log(err)
                throw err
            }
          })            
//modifier un client
app.put('/clients/:mail', async (req,res) => {
    try {
        const mail = req.params.email;
        const replacementClient = req.body
        const client = await db.collection('users').replaceOne({mail},replacementClient)
        res.status(200).json(client)
    } catch (err) {
        console.log(err)
        throw err
    }
  })     
          