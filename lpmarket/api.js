require('express');
require('mongodb');

exports.setApp = function(app, client)
{
    const User = require("./models/UserInfo.js");
    const Product = require("./models/ProductInfo.js");

    app.post('/api/login', async (req, res, next) => 
{
  // incoming: email, password
  // outgoing: id, firstName, lastName, error
    
 let error = '';

  const { email, password } = req.body;

  const db = client.db();
  const results = await db.collection('UserInfo').find({Email:email,Password:password}).toArray();

  var id = -1;
  var fn = '';
  var ln = '';

  var ret;

  if( results.length > 0 )
  {
    id = results[0].UserID;
    fn = results[0].FirstName;
    ln = results[0].LastName;

    try
    {
        const token = require("./createJWT.js");
        ret = token.createToken(fn, ln, id);
    }
    catch(e)
    {
        ret = {error:e.message};
    }
}
else
{
    ret = {error: "Login/Password incorrect"};
}

  // let ret = { id:id, firstName:fn, lastName:ln, error:''};
  res.status(200).json(ret);
});

app.post('/api/register', async (req, res, next) =>
{
  // incoming: firstName, lastName, email, password, phoneNumber
  // outgoing: error

  const { firstName, lastName, email, password, phoneNumber } = req.body;

  const newUser = {FirstName:firstName,LastName:lastName,Email:email,Password:password,PhoneNumber:phoneNumber,DateCreated: new Date()};
  var error = '';

  try
  {
    const db = client.db();
    const result = db.collection('UserInfo').insertOne(newUser);
  }
  catch(e)
  {
    error = e.toString();
  }

  var ret = { error: error };
  res.status(200).json(ret);
});

app.post('/api/search', async (req, res, next) => 
{
  // incoming: userId, search
  // outgoing: results[], error

  var error = '';

  const { userId, search } = req.body;
  // let token = require('./createJWT.js');
  // const { userId, search, jwtToken } = req.body;

  //   try
  //   {
  //       if( token.isExpired(jwtToken))
  //       {
  //           var r = {error:'The JWT is no longer valid', jwtToken: ''};
  //           res.status(200).json(r);
  //           return;
  //       }
  //   }
  //   catch(e)
  //   {
  //       console.log(e.message);
  //   }
    
  const db = client.db();
  let _ret = [];
    
  if ( search )
  {
      var _search = search.trim();
      
      const results = await db.collection('ProductInfo').find(
        {$or:[
        {"ProductName":{$regex:_search + '*', $options:'i',}},
        {"ProductCategory":{$regex:_search + '*', $options:'i'}}]}
        ).toArray();
      
      for( var i = 0; i < results.length; i++ )
      {
        _ret.push( results[i].ProductName );
        _ret.push( results[i].ProductCategory );
        _ret.push( results[i].ProductDescription );
        _ret.push( results[i].ProductPrice );
        _ret.push( results[i].ContactInfo );
        _ret.push( results[i].ProductState );
        _ret.push( results[i].ProductCity );
        _ret.push( results[i].ProductCondition );
      }
  }
  else
  {
      const results = await db.collection('ProductInfo').find().toArray();
      
      for( var i = 0; i < results.length; i++ )
      {
        _ret.push( results[i].ProductName );
        _ret.push( results[i].ProductCategory );
        _ret.push( results[i].ProductDescription );
        _ret.push( results[i].ProductPrice );
        _ret.push( results[i].ContactInfo );
        _ret.push( results[i].ProductState );
        _ret.push( results[i].ProductCity );
        _ret.push( results[i].ProductCondition );
      }
  }

//   var refreshedToken = null;
//   try
//   {
//     refreshedToken = token.refresh(jwtToken);
//   }
//   catch(e)
//   {
//       console.log(e.message);
//   }

  // var ret = {results:_ret, error:error, jwtToken: refreshedToken};
  var ret = {results:_ret, error:error};
  res.status(200).json(ret);
});

app.post('/api/addproduct', async (req, res, next) =>
{
  // incoming: productName, productCategory, productDescription, productPrice, contactInfo, email, 
  // outgoing: error

  // const { productName, productCategory, productDescription, productPrice, contactInfo, email } = req.body;
  let token = require('./createJWT.js');
  const { productName, productCategory, productDescription, productPrice, contactInfo, email, jwtToken } = req.body;

  try
  {
      if( token.isExpired(jwtToken))
      {
          var r = {error:'The JWT is no longer valid', jwtToken: ''};
          res.status(200).json(r);
          return;
      }
  }
  catch(e)
  {
      console.log(e.message);
  }

  const newProduct = {ProductName:productName,ProductCategory:productCategory,ProductDescription:productDescription,ProductPrice:productPrice,ContactInfo:contactInfo,Email:email,DateListed: new Date()};
  var error = '';

  try
  {
    const db = client.db();
    const result = db.collection('ProductInfo').insertOne(newProduct);
  }
  catch(e)
  {
    error = e.toString();
  }

  var refreshedToken = null;
  try
  {
    refreshedToken = token.refresh(jwtToken);
  }
  catch(e)
  {
      console.log(e.message);
  }

  var ret = { error: error, jwtToken: refreshedToken };
  res.status(200).json(ret);

  // var ret = { error: error };
  // res.status(200).json(ret);
});

app.post('/api/editproduct', async (req, res, next) =>
{
  // incoming: productName
  // outgoing: error

  const { productName, email, newName, newDescription, newCategory, newPrice, newContactInfo, newProductState, newProductCity, newProductCondition } = req.body;
  const productToUpdate = {ProductName:productName,Email:email}; 
  const updateInfo = 
  {
    $set: {
      ProductName:newName,
      ProductDescription:newDescription,
      ProductCategory:newCategory,
      ProductPrice:newPrice,
      ContactInfo:newContactInfo,
      ProductState:newProductState,
      ProductCity:newProductCity,
      ProductCondition:newProductCondition
    },
  };

  var error = '';

  try
  {
    const db = client.db();
    const result = db.collection('ProductInfo').updateOne(productToUpdate, updateInfo);
  }
  catch(e)
  {
    error = e.toString();
  }

  var ret = { error: error };
  res.status(200).json(ret);
});

app.post('/api/deleteproduct', async (req, res, next) =>
{
  // incoming: productName
  // outgoing: error

  let token = require('./createJWT.js');
  const { productName, jwtToken } = req.body;

  try
  {
      if( token.isExpired(jwtToken))
      {
          var r = {error:'The JWT is no longer valid', jwtToken: ''};
          res.status(200).json(r);
          return;
      }
  }
  catch(e)
  {
      console.log(e.message);
  }

  const deleteProduct = {ProductName:productName};
  var error = '';

  try
  {
    const db = client.db();
    const result = db.collection('ProductInfo').deleteOne(deleteProduct);
  }
  catch(e)
  {
    error = e.toString();
  }

  var refreshedToken = null;
  try
  {
    refreshedToken = token.refresh(jwtToken);
  }
  catch(e)
  {
      console.log(e.message);
  }

  var ret = { error: error, jwtToken: refreshedToken };
  res.status(200).json(ret);
});
}
