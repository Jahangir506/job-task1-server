const express = require('express');
const app = express()
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.db_USER}:${process.env.DB_PASS}@cluster0.ye7c1vr.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // await client.connect();

    const taskCollection = client.db('job_task1').collection('task')
    

   app.get('/task', async(req, res)=> {
    const result = await taskCollection.find().toArray()
    res.send(result)
   })

   app.put('/update', async (req, res) => {
    const id = req.query.id;
    const filter = { _id: new ObjectId(id) };
    const data = req.body;
    const updatedDoc = {
      $set: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        deadline: data.deadline,
        email: data.email,
      },
    };
    const result = await taskCollection.updateOne(filter, updatedDoc);
    res.send(result);
  });

  app.post('/task', async (req, res) => {
    const taskadd = req.body;
    const data = {
      title: taskadd.title,
      description: taskadd.description,
      date: taskadd.date,
      priority: taskadd.priority,
      status: 'todo',
    };
    const result = await taskCollection.insertOne(data);
    res.send(result);
  });

  app.patch('/status', async (req, res) => {
    const id = req.query.id;
    const data = req.body;
    const query = { _id: new ObjectId(id) };
    const updatedDoc = {
      $set: {
        status: data.status,
      },
    };
    const result = await taskCollection.updateOne(query, updatedDoc);
    res.send(result);
  });

  app.delete('/delete', async (req, res) => {
    const id = req.query.id;
    console.log(id);
    const query = { _id: new ObjectId(id) };
    const result = await taskCollection.deleteOne(query);
    res.send(result);
  });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('job task server is running!')
  })
  
  app.listen(port, () => {
    console.log(`job task app listening on port ${port}`)
  })