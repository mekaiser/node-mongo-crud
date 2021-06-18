const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const password = "u7$*BfJRvUQ-zny";

const uri =
  "mongodb+srv://organicUser0:u7$*BfJRvUQ-zny@cluster0.s07ju.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

client.connect((err) => {
  const productCollection = client.db("organicdb").collection("products");

  // ========== USING GET - TO LOAD ALL PRODUCTS ==========
  app.get("/products", (req, res) => {
    productCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  // ========== USING GET - TO LOAD A SINGLE PRODUCT ==========
  app.get("/product/:id", (req, res) => {
    productCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
      });
  });

  // ========== USING POST ==========
  app.post("/addProduct", (req, res) => {
    const product = req.body;
    productCollection.insertOne(product).then((result) => {
      // res.send('success');
      console.log("data added successfully");
    });
    res.redirect("/");
  });

  // ========== USING PATCH TO UPDATE ==========
  app.patch("/update/:id", (req, res) => {
    productCollection
      .updateOne(
        { _id: ObjectId(req.params.id) },
        {
          $set: { price: req.body.price, quantity: req.body.quantity },
        }
      )
      .then((result) => {
        res.send(result.modifiedCount > 0);
      });
  });

  // ========== USING DELETE ==========
  app.delete("/delete/:id", (req, res) => {
    productCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.send(result.deletedCount > 0);
      });
  });

  console.log("database connected");
  // perform actions on the collection object
  //   client.close();
});

app.listen(3000);
