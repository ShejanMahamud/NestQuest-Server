const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 4549;
const mongoURI = process.env.MONGO_URI;
const jwt = require("jsonwebtoken");
const secret_token = process.env.ACCESS_TOKEN_SECRET;

//app
const app = express();

//middlewares
app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);
app.use(express.json());

//mongo client
const client = new MongoClient(mongoURI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// middlewares
const verifyToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: "unauthorized access" });
  }
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, secret_token, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "unauthorized access" });
    }
    req.decoded = decoded;
    next();
  });
};

const run = async () => {
  try {
    //collections
    const usersCollection = client.db("nestquest").collection("users");
    const advertiseCollection = client.db('nestquest').collection('advertise')
    const reviewsCollection = client.db('nestquest').collection('reviews')
    const propertiesCollection = client.db('nestquest').collection('properties')

    //get users from db
    app.get('/users',async(req,res)=>{
      const result = await usersCollection.find().toArray()
      res.send(result)
    })

    //get a single user from db
    app.get('/user/:email',async(req,res)=>{
      const query = {email: req.params.email}
      const result = await usersCollection.findOne(query)
      res.send(result)
    })

    //get all properties from db
    app.get('/properties',async(req,res)=>{
      let query = {};
      if(req.query.verified){
        query = {property_status: 'Verified'}
      }
      const result = await propertiesCollection.find(query).toArray()
      res.send(result)
    })

    //get agent based properties
    app.get('/properties/:email',async(req,res)=>{
      const query = {agent_email: req.params.email}
      const result = await propertiesCollection.find(query).toArray();
      res.send(result)
    })

    //get a single property based on id
    app.get('/property/:id',async(req,res)=>{
      const query = {_id : new ObjectId(req.params.id)};
      const result = await propertiesCollection.findOne(query)
      res.send(result)
    })

    //get role for a user
    app.get('/role/:email',async(req,res)=>{
      const query = {email: req.params.email}
      const result = await usersCollection.findOne(query)
      res.send({role: result.role})
    })

    //get reviews from db
    app.get('/reviews',async(req,res)=>{
      const result = await reviewsCollection.find().toArray();
      res.send(result)
    })

    //get advertise from db
    app.get('/advertises',async(req,res)=>{
      const result = await advertiseCollection.find().toArray();
      res.send(result)
    })

    //save a property in db
    app.post('/properties',async(req,res)=>{
      const property = req.body;
      const result = await propertiesCollection.insertOne(property)
      if(result.insertedId){
        res.send({success: true})
      }
    })

    //save a user in db in register
    app.post('/users',async(req,res)=>{
      const user = req.body;
      const result = await usersCollection.insertOne(user)
      res.send(result)
    })

    // jwt related api
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, secret_token, {
        expiresIn: "24h",
      });
      res.send({ token });
    });

    //update a user
    app.patch('/user/:email',async(req,res) => {
      try{
        const user = req.body;
      const query = {email: req.params.email}
      const updateUser = {
        $set: {}
      }
      for(const key in user){
        if(user.hasOwnProperty(key)){
          updateUser.$set[key] = user[key]
        }
      }
      const result = await usersCollection.updateOne(query,updateUser)
      if(result.modifiedCount > 0){
        res.send({success: true})
      }
      }
      catch(error){
        res.send({success: false})
      }
    })

    //update a property from agent dashbaord
    app.patch('/property/:id',async(req,res)=>{
      try{
        const property = req.body;
        console.log(property)
      const query = {_id: new ObjectId(req.params.id)}
      const updateProperty = {
        $set:property
      }
      const result = await propertiesCollection.updateOne(query,updateProperty)
      if(result.modifiedCount > 0){
        res.send({success: true})
      }
      }
      catch(error){
        res.send({success:false})
      }
    })

  } finally {
  }
};

run().catch((error) => console.log);

app.get("/", (req, res) => {
  res.send({ server_status: "Server Running" });
});

app.listen(port, () => {
  console.log("Server running on", port);
});
