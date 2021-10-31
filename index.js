const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config()

const app = express();
const  port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nlfvc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){

     try{
       await client.connect();
       const database = client.db('skylineTour');
       const toursCollection = database.collection('tours');

    // Get All data
    app.get('/tours', async(req, res) =>{
        const cursor = toursCollection.find({});
        const tours = await cursor.toArray();
        res.send(tours);
    })

    // Get Single Data
 
       app.get('/tours/:id', async(req, res) =>{
           const id = req.params.id;
           console.log('getting specific id', id);
           const query = { _id: ObjectId(id)};
           const tour = await toursCollection.findOne(query);
           res.json(tour);
       })


    //  Post
      app.post('/tours', async(req, res) =>{
          const tour = req.body;
        console.log('hit the post api', tour)

         const result = await toursCollection.insertOne(tour);
         console.log(result);
        res.json(result)
      });
    
    // Delete Data
    app.delete('/tours/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)};
        const result = await toursCollection.deleteOne(query);
        res.json(result);
    })

     }
     finally{
        //  await client.close();
     }

}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Skyline Server');
})

app.listen(port, () => {
    console.log('Running Skyline Server on Port', port);
})