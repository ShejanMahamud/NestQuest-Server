const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 4549;
const mongoURI = process.env.MONGO_URI;
const jwt = require("jsonwebtoken");
const secret_token = process.env.ACCESS_TOKEN_SECRET;
const stripe = require("stripe")(process.env.ST_SECRET_KEY);
//app
const app = express();

//middlewares
app.use(
  cors({
    origin: ["http://localhost:5173", "https://nestquest-web.netlify.app"],
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
    const advertiseCollection = client.db("nestquest").collection("advertise");
    const reviewsCollection = client.db("nestquest").collection("reviews");
    const wishlistCollection = client.db("nestquest").collection("wishlist");
    const offeredCollection = client.db("nestquest").collection("offered");
    const propertiesCollection = client
      .db("nestquest")
      .collection("properties");

    //get users from db
    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    //get a single user from db
    app.get("/user/:email", async (req, res) => {
      const query = { email: req.params.email };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    //get all properties from db based on verified status and agent not fraud
    app.get("/properties", async (req, res) => {
      try {
        let query = { property_status: "Verified" };
        if (req.query.search) {
          query.property_location = {
            $regex: req.query.search || "",
            $options: "i",
          };
        }
        const pipeline = [
          {
            $match: query,
          },
          {
            $lookup: {
              from: "users",
              localField: "agent_email",
              foreignField: "email",
              as: "agent_info",
            },
          },
          {
            $unwind: "$agent_info",
          },
          {
            $match: {
              "agent_info.status": { $ne: "Fraud" },
            },
          },
        ];
        if (req.query.sort) {
          pipeline.push({
            $sort: { property_price_min: 1, property_price_max: 1 },
          });
        }
        pipeline.push({
          $project: {
            agent_info: 0,
          },
        });
        const result = await propertiesCollection.aggregate(pipeline).toArray();
        res.send(result);
      } catch (error) {
        res.send({ error: error });
      }
    });

    //get all properties with no condition
    app.get("/all_properties", async (req, res) => {
      let query = {}
      if(req.query.verified){
        query = {property_status: 'Verified'}
      }
      if(req.query.advertise){
        query = {property_advertise: true}
      }
      const result = await propertiesCollection.find(query).toArray();
      res.send(result);
    });

    //get agent based properties
    app.get("/properties/:email", async (req, res) => {
      const query = { agent_email: req.params.email };
      const result = await propertiesCollection.find(query).toArray();
      res.send(result);
    });

    //get a single property based on id
    app.get("/property/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const result = await propertiesCollection.findOne(query);
      res.send(result);
    });

    //get role for a user
    app.get("/role/:email", verifyToken, async (req, res) => {
      console.log(req.decoded);
      const query = { email: req.params.email };
      const result = await usersCollection.findOne(query);
      res.send({ role: result.role });
    });

    //get reviews from db based on id
    app.get("/reviews/:id", async (req, res) => {
      const result = await reviewsCollection
        .aggregate([
          {
            $match: { property_id: req.params.id },
          },
          {
            $lookup: {
              from: "users",
              localField: "user_email",
              foreignField: "email",
              as: "user_info",
            },
          },
          {
            $unwind: "$user_info",
          },
          {
            $project: {
              review_title: 1,
              review_description: 1,
              review_rating: 1,
              property_id: 1,
              user_email: 1,
              user_name: "$user_info.name",
              user_photo: "$user_info.photo",
            },
          },
          {
            $group: {
              _id: "$property_id",
              average_rating: { $avg: "$review_rating" },
              review_count: { $sum: 1 },
              reviews: { $push: "$$ROOT" },
            },
          },
          {
            $project: {
              _id: 0,
              property_id: "$_id",
              average_rating: 1,
              review_count: 1,
              reviews: 1,
            },
          },
        ])
        .toArray();
      res.send(result);
    });

    //get review based on user
    app.get("/review/:email", async (req, res) => {
      const result = await reviewsCollection
        .find({ user_email: req.params.email })
        .toArray();
      res.send(result);
    });

    //get all reviews from db
    app.get("/all_reviews", async (req, res) => {
      const result = await reviewsCollection
        .aggregate([
          {
            $lookup: {
              from: "users",
              localField: "user_email",
              foreignField: "email",
              as: "user_info",
            },
          },
          {
            $unwind: "$user_info",
          },
          {
            $project: {
              review_title: 1,
              review_description: 1,
              review_rating: 1,
              property_id: 1,
              user_email: 1,
              user_name: "$user_info.name",
              user_photo: "$user_info.photo",
              review_time: 1,
            },
          },
        ])
        .toArray();
      res.send(result);
    });

    //get advertise from db
    app.get("/advertises", async (req, res) => {
      const result = await advertiseCollection.find().toArray();
      res.send(result);
    });

    //get bought properties based on user
    app.get("/bought/:email", async (req, res) => {
      const query = { buyer_email: req.params.email };
      const result = await offeredCollection.find(query).toArray();
      res.send(result);
    });

    //get wishlists based on user email
    app.get("/wishlist/:email", async (req, res) => {
      const query = { user_email: req.params.email };
      const result = await wishlistCollection.find(query).toArray();
      res.send(result);
    });

    //get offered properties based on agent email
    app.get("/requested/:email", async (req, res) => {
      const result = await offeredCollection
        .find({ agent_email: req.params.email })
        .toArray();
      res.send(result);
    });

    //get a offered properties based on id
    app.get("/offered/:id", async (req, res) => {
      const result = await offeredCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(result);
    });

    //get sold properties for specific agent
    app.get("/solds/:email", async (req, res) => {
      const pipeline = [
        {
          $match: {
            agent_email: req.params.email,
            status: "Bought",
          },
        },
        {
          $group: {
            _id: 0,
            properties: { $push: "$$ROOT" },
            sold_amount: { $sum: "$offer_price" } // Corrected sum operator
          }
        },
        {
          $project: {
            _id: 0,
            properties: 1,
            sold_amount: 1
          }
        }
      ];
      try {
        const result = await offeredCollection.aggregate(pipeline).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });
    

    //post a review on db
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewsCollection.insertOne(review);
      if (result.insertedId) {
        res.send({ success: true });
      }
    });

    //set a property as a wishlist
    app.post("/wishlist", async (req, res) => {
      const wishlist = req.body;
      const result = await wishlistCollection.insertOne(wishlist);
      if (result.insertedId) {
        res.send({ success: true });
      }
    });

    //set a offered property to database
    app.post("/offered", async (req, res) => {
      const result = await offeredCollection.insertOne(req.body);
      if (result.insertedId) {
        res.send({ success: true });
      }
    });

    //save a property in db
    app.post("/properties", async (req, res) => {
      const property = req.body;
      const result = await propertiesCollection.insertOne(property);
      if (result.insertedId) {
        res.send({ success: true });
      }
    });

    //save a user in db in register
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    // jwt related api
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, secret_token, {
        expiresIn: "24h",
      });
      res.send({ token });
    });

    //create stripe checkout session
    app.post("/stripe_payment", async (req, res) => {
      const { price } = req.body;
      const amount = parseInt(price * 100);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: ["card"],
      });
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    });

    //update a user
    app.patch("/user/:email", async (req, res) => {
      try {
        const user = req.body;
        const query = { email: req.params.email };
        const updateUser = {
          $set: {},
        };
        for (const key in user) {
          if (user.hasOwnProperty(key)) {
            updateUser.$set[key] = user[key];
          }
        }
        const result = await usersCollection.updateOne(query, updateUser);
        if (result.modifiedCount > 0) {
          res.send({ success: true });
        }
      } catch (error) {
        res.send({ success: false });
      }
    });

    //update a property from agent dashbaord
    app.patch("/property/:id", async (req, res) => {
      try {
        const property = req.body;
        const query = { _id: new ObjectId(req.params.id) };
        const updateProperty = {
          $set: property,
        };
        const result = await propertiesCollection.updateOne(
          query,
          updateProperty
        );
        if (result.modifiedCount > 0) {
          res.send({ success: true });
        }
      } catch (error) {
        res.send({ success: false });
      }
    });

    //update a property from admin dash
    app.patch('/admin_properties/:id',async(req,res)=>{
      const result = await propertiesCollection.updateOne({_id: new ObjectId(req.params.id)},{$set: req.body})
      if(result.modifiedCount > 0){
        res.send({success: true})
      }
      
    })

    //change status of offered property
    app.patch("/offered/:id", async (req, res) => {
      if (req.body.status === "Verified") {
        const result = await offeredCollection.updateMany(
          { property_id: req.body.property_id },
          {
            $set: { status: "Rejected" },
          }
        );
      }
      const result = await offeredCollection.updateOne(
        { _id: new ObjectId(req.params.id) },
        {
          $set: req.body,
        }
      );
      if (result.modifiedCount > 0) {
        res.send({ success: true });
      }
    });

    //delete a review from db
    app.delete("/review/:id", async (req, res) => {
      const result = await reviewsCollection.deleteOne({
        _id: new ObjectId(req.params.id),
      });
      if (result.deletedCount > 0) {
        res.send({ success: true });
      }
    });
    //delete a wishlist property from db
    app.delete("/wishlist/:id", async (req, res) => {
      const result = await wishlistCollection.deleteOne({
        _id: new ObjectId(req.params.id),
      });
      if (result.deletedCount > 0) {
        res.send({ success: true });
      }
    });

    //delete a user as admin
    app.delete("/user/:email", async (req, res) => {
      const result = await usersCollection.deleteOne({
        email: req.params.email,
      });
      if (result.deletedCount > 0) {
        res.send({ success: true });
      }
    });
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
