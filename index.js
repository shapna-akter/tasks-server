const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qlhnchw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const taskCollection = client.db("addTasks").collection("tasks");

        // User send to database
        app.post('/tasks', async (req, res) => {
            const user = req.body;
            const result = await taskCollection.insertOne(user);
            res.send(result);
        })

        // user get from database
        app.get('/tasks', async (req, res) => {
            const query = {};
            const users = await taskCollection.find(query).toArray();
            res.send(users);
        });

        app.delete('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await taskCollection.deleteOne(filter);
            res.send(result)
        })

    } finally {

    }
}
run().catch(err => console.log(err));

app.get('/', async (req, res) => {
    res.send('Doctors portal server is running');
})

app.listen(port, async (req, res) => {
    console.log(`Server is running on port ${port}`);
})