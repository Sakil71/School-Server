const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('School Server Active...');
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.pw2gnqu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const applyCOllections = client.db('apply-collections').collection('apply');

        app.post('/apply', async (req, res) => {
            const apply = req.body;
            const result = await applyCOllections.insertOne(apply);
            res.send(result);
        })

        app.get('/apply', async (req, res) => {
            const apply = await applyCOllections.find({}).toArray();
            res.send(apply);
        })

        app.get('/apply-details/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            console.log(id);
            const result = await applyCOllections.find(query).toArray();
            res.send(result);
        })

        app.get('/application/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const result = await applyCOllections.findOne(query);
            res.send(result);
        })
    }
    finally { }
}
run().catch(error => console.log(error));


app.listen(port, () => {
    console.log(`School Server Running On Port: ${port}`);
})
