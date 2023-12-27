const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
// const jwt = require('jsonwebtoken');
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

// function verifyJWT (req, res, next){
//     const authHeader = req.headers.authorization;
//     if(!authHeader){
//         return res.status(403).send('unauthorized token');
//     }
//     const token = authHeader.split(' ')[1];
//     jwt.verify(token, process.env.ACCESS_TOKEN, function(error, decoded){
//         if(error){
//             return res.status(403).send({message : 'access forbidden'});
//         }
//         req.decoded = decoded;
//         next();
//     })
// }

async function run() {
    const applyCollections = client.db('school').collection('apply');
    const teachersCollections = client.db('school').collection('teacher');
    const usersCollections = client.db('school').collection('user');
    const noticesCollections = client.db('school').collection('notices');

    try {
        app.post('/teacher', async (req, res) => {
            const teacher = req.body;
            const result = await teachersCollections.insertOne(teacher);
            res.send(result);
        })

        app.get('/teacher', async (req, res) => {
            res.send(await teachersCollections.find({}).toArray());
        })
        app.get('/teacher/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await teachersCollections.findOne(query);
            res.send(result);
        })

        app.delete('/teacher/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await teachersCollections.deleteOne(query);
            res.send(result);
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollections.insertOne(user);
            res.send(result);
        })

        app.get('/users', async (req, res) => {
            res.send(await usersCollections.find({}).toArray());
        })

        app.patch('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    role: 'admin'
                },
            };
            const result = await usersCollections.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await usersCollections.deleteOne(query);
            res.send(result);
        })

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await usersCollections.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
        })

        app.post('/apply', async (req, res) => {
            const apply = req.body;
            const result = await applyCollections.insertOne(apply);
            res.send(result);
        })

        app.get('/apply', async (req, res) => {
            const apply = (await applyCollections.find({}).toArray()).reverse();
            res.send(apply);
        })

        app.get('/apply-details/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            console.log(id);
            const result = await applyCollections.find(query).toArray();
            res.send(result);
        })

        app.delete('/apply/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await applyCollections.deleteOne(query);
            res.send(result);
        })

        app.patch('/apply/confirm/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    confirm: 'confirmed'
                }
            }
            const result = await applyCollections.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        app.get('/students/:admissionClass', async (req, res) => {
            const admissionClass = req.params.admissionClass;
            const query = { admissionClass };
            const result = await applyCollections.find(query).toArray();
            res.send(result);
        })

        app.get('/application/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const result = await applyCollections.findOne(query);
            res.send(result);
        })

        app.post('/notices', async (req, res) => {
            const notices = req.body;
            const result = await noticesCollections.insertOne(notices);
            res.send(result);
        })

        app.get('/notices', async (req, res) => {
            res.send((await noticesCollections.find({}).toArray()).reverse());
        })

        app.delete('/notices/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await noticesCollections.deleteOne(query);
            res.send(result);
        })

        // app.get('/jwt', async(req, res) =>{
        //     const email = req.params.email;
        //     const query = {email};
        //     const user = await applyCollections.findOne(query);
        //     if(user){
        //         const token = jwt.sign({email}, process.env.ACCESS_TOKEN, {expiresIn: "30d"});
        //         return res.send({accessToken : token});
        //     } 
        //     res.status(403).send({accessToken : ''});
        // })
    }
    finally { }
}
run().catch(error => console.log(error));


app.listen(port, () => {
    console.log(`School Server Running On Port: ${port}`);
})
