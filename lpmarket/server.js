const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');
const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const path = require('path');           
const PORT = process.env.PORT || 5000;
const app = express();
const ejs = require('ejs');
app.set('port', (process.env.PORT || 5000));
app.set('view engine', 'ejs');
app.use(cors());
app.use(bodyParser.json());
app.use(methodOverride('_method'));
require('dotenv').config();

const url = process.env.MONGODB_URI;
const mongoose = require("mongoose");
mongoose.connect(url)
  .then(() => console.log("MongoDB connected!"))
  .catch(err => console.log(err));

// const MongoClient = require('mongodb').MongoClient;
// const client = new MongoClient(url);
// client.connect();

let gfs;
const conn = mongoose.createConnection(url);
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
})

const storage = new GridFsStorage({
  url: url,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
  res.json({file: req.file});
});

var api = require('./api.js');
api.setApp(app, mongoose);

// Server static assets if in production
if (process.env.NODE_ENV === 'production') 
{
  // Set static folder
  app.use(express.static('frontend/build'));
  app.get('*', (req, res) => 
  {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}


// app.post('/api/login', async (req, res, next) => 
// {
//   // incoming: email, password
//   // outgoing: id, firstName, lastName, error
    
//  var error = '';

//   const { email, password } = req.body;

//   const db = client.db();
//   const results = await db.collection('UserInfo').find({Email:email,Password:password}).toArray();

//   var id = -1;
//   var fn = '';
//   var ln = '';

//   if( results.length > 0 )
//   {
//     id = results[0].UserID;
//     fn = results[0].FirstName;
//     ln = results[0].LastName;
//   }

//   var ret = { id:id, firstName:fn, lastName:ln, error:''};
//   res.status(200).json(ret);
// });

// app.post('/api/register', async (req, res, next) =>
// {
//   // incoming: firstName, lastName, email, password, phoneNumber
//   // outgoing: error

//   const { firstName, lastName, email, password, phoneNumber } = req.body;

//   const newUser = {FirstName:firstName,LastName:lastName,Email:email,Password:password,PhoneNumber:phoneNumber,DateCreated: new Date()};
//   var error = '';

//   try
//   {
//     const db = client.db();
//     const result = db.collection('UserInfo').insertOne(newUser);
//   }
//   catch(e)
//   {
//     error = e.toString();
//   }

//   var ret = { error: error };
//   res.status(200).json(ret);
// });

// app.post('/api/search', async (req, res, next) => 
// {
//   // incoming: userId, search
//   // outgoing: results[], error

//   var error = '';

//   const { userId, search } = req.body;
//   var _search = search.trim();

//   const db = client.db();

//   const results = await db.collection('ProductInfo').find(
//       {$or:[
//       {"ProductName":{$regex:_search + '*', $options:'r',}},
//       {"ProductCategory":{$regex:_search + '*', $options:'r'}}]}
//       ).toArray();

//   let _ret = [];

//   for( var i = 0; i < results.length; i++ )
//   {
//       _ret.push( results[i].ProductName );
//       _ret.push( results[i].ProductCategory );
//       _ret.push( results[i].ProductDescription );
//       _ret.push( results[i].ProductPrice );
//       _ret.push( results[i].ContactInfo );
//   }

//   var ret = {results:_ret, error:error};
//   res.status(200).json(ret);
// });

// app.post('/api/addproduct', async (req, res, next) =>
// {
//   // incoming: productName, productCategory, productDescription, productPrice, contactInfo, email, 
//   // outgoing: error

//   const { productName, productCategory, productDescription, productPrice, contactInfo, email } = req.body;

//   const newProduct = {ProductName:productName,ProductCategory:productCategory,ProductDescription:productDescription,ProductPrice:productPrice,ContactInfo:contactInfo,Email:email,DateListed: new Date()};
//   var error = '';

//   try
//   {
//     const db = client.db();
//     const result = db.collection('ProductInfo').insertOne(newProduct);
//   }
//   catch(e)
//   {
//     error = e.toString();
//   }

//   var ret = { error: error };
//   res.status(200).json(ret);
// });

// app.post('/api/editproduct', async (req, res, next) =>
// {
//   // incoming: productName
//   // outgoing: error

//   const { productName, email, newName, newDescription } = req.body;
//   const productToUpdate = {ProductName:productName,Email:email}; 
//   const updateInfo = 
//   {
//     $set: {
//       ProductName:newName,
//       ProductDescription:newDescription
      
//     },
//   };

//   var error = '';

//   try
//   {
//     const db = client.db();
//     const result = db.collection('ProductInfo').updateOne(productToUpdate, updateInfo);
//   }
//   catch(e)
//   {
//     error = e.toString();
//   }

//   var ret = { error: error };
//   res.status(200).json(ret);
// });

// app.post('/api/deleteproduct', async (req, res, next) =>
// {
//   // incoming: productName
//   // outgoing: error

//   const { productName } = req.body;

//   const deleteProduct = {ProductName:productName};
//   var error = '';

//   try
//   {
//     const db = client.db();
//     const result = db.collection('ProductInfo').deleteOne(deleteProduct);
//   }
//   catch(e)
//   {
//     error = e.toString();
//   }

//   var ret = { error: error };
//   res.status(200).json(ret);
// });


app.use((req, res, next) => 
{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

// app.listen(5000); // start Node + Express server on port 5000
app.listen(PORT, () => 
{
  console.log('Server listening on port ' + PORT);
});
