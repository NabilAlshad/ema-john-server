const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config();
const app = express();

app.use(express.json());

app.use(cors());

const port = 4001;

const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sblya.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const productCollection = client.db("emaStore").collection("products");
  const orderCollection = client.db("emaStore").collection("orders");

  console.log("connected");

  //post
  app.post("/addProduct", (req, res) => {
    const products = req.body;
    console.log(products);
    productCollection.insertOne(products).then((result) => {
      console.log(result.insertedCount);

      res.send(result.insertedCount);
    });
  });
  //get products

  app.get("/products", (req, res) => {
    productCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
  app.get("/product/:key", (req, res) => {
    productCollection
      .find({ key: req.params.key })
      .toArray((err, documents) => {
        res.send(documents[0]);
      });
  });
  app.post("/productsByKeys", (req, res) => {
    const productKeys = req.body;
    productCollection
      .find({ key: { $in: productKeys } })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });
  app.post("/addOrder", (req, res) => {
    const products = req.body;
    console.log(order);
    orderCollection.insertOne(products).then((result) => {
      console.log(result.insertedCount);

      res.send(result.insertedCount > 0);
    });
  });
});

app.listen(process.env.PORT || port);
