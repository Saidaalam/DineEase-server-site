const express = require('express');
const cors = require('cors');
//const jwt = require ('jsonwebtoken');
//const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;
const app = express();

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://assignment11-77574.web.app',
    'https://assignment11-77574.firebaseapp.com'
  ],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
//app.use(cookieParser());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.jasskbt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

//const logger = async(req, res, next) => {
 // console.log('called', req.hostname, req.originalUrl);
 // next();
//}

//const verifyToken = async(req, res, next) => {
//  const token = req.cookies?.token;
//  console.log('middleware token value', token)
// if(!token){
//    return res.status(401).send({message: 'not authorized'})
//  }
//  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
//   if(error){
//      console.log(error);
 //     return res.status(401).send({message: 'unauthorized'})
 //   }
 //   console.log('value', decoded)
 //   next()
//  })
//}



async function run() {
  try {
    //await client.connect();

    app.get('/foods', async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      console.log('pagination query', page, size);
      const result = await foodCollection.find()
      .skip(page * size)
      .limit(size)
      .toArray();
      res.send(result);
    });

    const foodCollection = client.db('foodDB').collection('food');
    const purchaseCollection = client.db('foodDB').collection('purchase');
    const galleryCollection = client.db('foodDB').collection('gallery');

    //auth related api

   // app.post('/jwt', async(req, res) => {
    //const loggedUser = req.body;
    //  console.log(loggedUser);
     // const token = jwt.sign(loggedUser, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'})
     // res
    //  .cookie('token', token, {
     //   httpOnly: true,
    //    secure: false,
     //   sameSite: 'none'
    //  })
    //  .send({success : true});
   // })

    //service related api

    app.post('/foods', async (req, res) => {
      try {
        const order = req.body;
        const result = await foodCollection.insertOne(order);
        res.send(result);
      } catch (error) {
        console.error('Error inserting food:', error);
        res.status(500).send('Internal Server Error');
      }
    });

    app.delete('/foods/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await foodCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        console.error('Error deleting food:', error);
        res.status(500).send('Internal Server Error');
      }
    });

    app.get('/purchase', async (req, res) => {
      console.log(req.query.email);
      let query = {};
      if(req.query?.email){
        query = {email: req.query.email}
      }
        const result = await purchaseCollection.find(query).toArray();
        res.send(result);
    });

    app.post('/purchase', async (req, res) => {
        const info = req.body;
        const result = await purchaseCollection.insertOne(info);
        res.send(result);
    });
   
app.delete('/purchase/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await purchaseCollection.deleteOne(query);
    res.send(result);
  } catch (error) {
    console.error('Error deleting food:', error);
    res.status(500).send('Internal Server Error');
  }
});

    app.put('/foods/:id', async (req, res) => {
      console.log(req.params.id);
      const query = { _id: new ObjectId(req.params.id) };
      const data = {
        $set: {
          name: req.body.name,
        category: req.body.category,
        quantity: req.body.quantity,
        price: req.body.price,
        origin: req.body.origin,
        description: req.body.description,
        image: req.body.image,
        }
      };

      delete data.$set.email;

      const result = await foodCollection.updateOne(query, data);
      console.log(result);
      res.send(result);
    });

    app.get('/gallery', async (req, res) => {
      try {
        const result = await galleryCollection.find().toArray();
        res.send(result);
      } catch (error) {
        console.error('Error fetching gallery:', error);
        res.status(500).send('Internal Server Error');
      }
    });

    app.post('/gallery', async (req, res) => {
      const newPic = req.body;
      console.log('New Pic:', newPic);
      try {
          const result = await galleryCollection.insertOne(newPic);
          res.send(result);
      } catch (err) {
          console.error('Error inserting document:', err);
          res.status(500).send('Internal Server Error');
      }
    });

    //await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } finally {
    // Ensure to close the client connection when finished
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello! Welcome to my Server....');
});

app.listen(port, () => console.log(`Server running on port ${port}`));
