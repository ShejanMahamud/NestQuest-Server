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
    origin: [
      "http://localhost:5173"
    ]
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
        return res.status(401).send({ message: 'unauthorized access' });
      }
      const token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).send({ message: 'unauthorized access' })
        }
        req.decoded = decoded;
        next();
      })
    }

const run = async () => {
  try {
    // jwt related api
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, secret_token, {
        expiresIn: "24h",
      });
      res.send({ token });
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
