const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wp8tr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(bodyParser.json())
app.use(cors());


app.get('/', (req, res) => {
    res.send('Hello World!');
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db("emaJohnStore").collection("products");
    app.post('/addProduct',(req,res)=>{
        const products = req.body;
        productsCollection.insertMany(products)
        .then(result =>{
            console.log(result.insertedCount);
            res.status(200).send(result.insertedCount)
        })
    })

    app.get('/products',(req,res)=>{
      productsCollection.find({})
      .toArray((err,documents)=>{
          res.send(documents);
      })  
    })


    app.get('/product/:key',(req,res)=>{
        productsCollection.find({key: req.params.key})
        .toArray((err,documents)=>{
            res.send(documents[0]);
        })  
    })

    app.post('/productsByKeys', (req,res)=>{
        const productKeys = req.body;
        productsCollection.find({key: { $in: productKeys}})
        .toArray((err , documents) => {
            res.send(documents);
        })
    })


});



app.listen(port, () => {
    console.log(`Example app listening port at http://localhost:${port}`)
})