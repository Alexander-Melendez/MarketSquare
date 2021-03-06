require('express');
require('mongodb');
require("dotenv").config();
const User = require("./models/UserInfo.js");
const Product = require("./models/ProductInfo.js");
const jwt = require("jsonwebtoken");


const mailgun = require("mailgun-js");
const DOMAIN = "smarketsquare.com";
const mg = mailgun({ apiKey: process.env.MAILGUN_APIKEY, domain: DOMAIN });


exports.setApp = function (app, client) {

  app.post('/api/login', async (req, res, next) => {
    // incoming: email, password
    // outgoing: id, firstName, lastName, error

    let error = '';

    const { email, password } = req.body;

    // const db = client.db();
    // const results = await db.collection('UserInfo').find({Email:email,Password:password}).toArray();
    const results = await User.find({ Email: email, Password: password });

    var id = -1;
    var fn = '';
    var ln = '';
    var em = '';
    var pn = '';

    var ret;

    if (results.length > 0) {
      id = results[0]._id;
      fn = results[0].FirstName;
      ln = results[0].LastName;
      em = results[0].Email;
      pn = results[0].PhoneNumber;

      try {
        const token = require("./createJWT.js");
        ret = token.createToken(fn, ln, id, em, pn);
      }
      catch (e) {
        ret = { error: e.message };
      }
    }
    else {
      ret = { error: "Login/Password incorrect" };
    }

    // let ret = { id:id, firstName:fn, lastName:ln, error:''};
    res.status(200).json(ret);
  });

  app.post('/api/register', async (req, res, next) => {
    // incoming: firstName, lastName, email, password, phoneNumber
    // outgoing: error

    const { firstName, lastName, email, password, phoneNumber } = req.body;

    const emailCheck = await User.findOne({ Email: email });

    if (emailCheck)
      return res.status(400).json({ success: false, error: "This email already exists!" });

    const token = jwt.sign({ firstName, lastName, email, password, phoneNumber }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20m' });

    const data = {
      from: "noreply@marketsquare.com",
      to: email,
      subject: 'Account Activation Link',
      html: `
          <body>
          <h2>Please click on the given link to activate your account!</h2>
          <p>
             <a href="${process.env.CLIENT_URL}emailverification/${token}">Click Here to Verify your Account</a>
          </p>
          </body>
    `
    };
    mg.messages().send(data, function (error, body) {
      if (error) {
        return res.json({
          error: error.message
        })
      }
      return res.json({ message: 'Email has been sent, kindly activate your account' });
    });

    /*const newUser = {FirstName:firstName,LastName:lastName,Email:email,Password:password,PhoneNumber:phoneNumber,DateCreated: new Date()};
    var error = '';
  
  
    try
    {
      // const db = client.db();
      // const result = db.collection('UserInfo').insertOne(newUser);
      const result = User.create(newUser);
    }
    catch(e)
    {
      error = e.toString();
    }
  
    var ret = { error: error };
    res.status(200).json(ret);*/
  });

  app.post('/api/activateAccount', async (req, res, next) =>
  {
      const {token} = req.body;
  
      if (token)
      {
          jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decodedToken) {
            if (err)
            {
              return res.status(400).json({error: 'Incorrect or Expired Link.'});
            }
  
            const {firstName,lastName, email, password, phoneNumber} = decodedToken;
  
            User.findOne({email}).exec((err, user) => {
              
              /*
              if (user)
              {
                return res.status(400).json({error: "User with this email already exists!"});
              }
              */
              const newUser = {FirstName:firstName,LastName:lastName,Email:email,Password:password,PhoneNumber:phoneNumber,DateCreated: new Date()};
              var error = '';
  
  
            try
            {
              // const db = client.db();
              // const result = db.collection('UserInfo').insertOne(newUser);
              const result = User.create(newUser);
            }
            catch(e)
            {
              error = e.toString();
            }
  
            var ret = { error: "No Errors, Signup Successful!" };
            res.status(200).json(ret);
          });
        });
      }
    });

    // Sends email to reset password
  app.post('/api/forgotPassword', async (req, res, next) =>
  {
    const { email } = req.body;
    var ret;

    const emailCheck = await User.findOne({ Email: email });

    if (!emailCheck)
    {
      ret = { error: "No users found with this email"}
      return res.status(400).json({success: false, error: ret});
    }
    
    const id = emailCheck._id;
    const fn = emailCheck.firstName;
    const ln = emailCheck.lastName;


    const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '20m'});

    const data = {
      from: "noreply@marketsquare.com",
      to: email,
      subject: 'Reset Password Link',
      html: `
            <body>
            <h2>Hello, Please click on the given link to reset your password!</h2>
            <p>
              <a href="${process.env.CLIENT_URL}resetpassword/${token}">Click Here to Reset your Password</a>
            </p>
            </body>
      `     
    };
    mg.messages().send(data, function (error, body){
      if(error)
      {
        return res.json({
          error: error.message
        })
      }
      return res.json({message: 'Email has been sent, Reset your password'});
    });
  });


  // Actually resets the password
app.post('/api/resetPassword', async (req, res, next) =>
{
    var ret;

    const { token, Password } = req.body;
    const updateInfo =
    {
        Password: Password
    };

    try
    {
    if (token)
    {
      console.log("Entered token statement");
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async function(err, decodedToken) {
          if (err)
          {
            return res.status(400).json({error: 'Incorrect or Expired Link.'});
          }

          const {firstName, lastName, email, password, phoneNumber} = decodedToken;

          const checkedUser = await User.findOne({ Email: email });

          if (!checkedUser)
          {
            ret = { error: "Unable to find user"}
            return res.status(400).json(ret);
          }

          // ret = { Email: email};

          const userToUpdate = {Email: email};
          
          var error = '';


          try {
            // const db = client.db();
            // const result = db.collection('UserInfo').updateOne(userToUpdate, updateInfo);
            const result = await User.findOneAndUpdate(userToUpdate, updateInfo);
          }
          catch (e) {
            error = e.toString();
          }

          var ret = { error: "No Errors, Reset Successful!" };
          return res.status(200).json(ret);
      });
    }
  }
  catch{ 
  
      console.log("error in resetting password");
      return res.json({error: "Error resetting password"});
  }
  });

  app.post('/api/search', async (req, res, next) => {
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

    // const db = client.db();
    let _ret = [];
    var results;

    var _search = search ? search.trim() : "";

    if (_search !== "") {
      /*
      const results = await db.collection('ProductInfo').find(
      {$or:[
      {"ProductName":{$regex:_search + '*', $options:'i',}},
      {"ProductCategory":{$regex:_search + '*', $options:'i'}}]}
      ).toArray();
      */

      results = await Product.find(
        {
          $or: [
            { "ProductName": { $regex: _search + '*', $options: 'i', } },
            { "ProductCategory": { $regex: _search + '*', $options: 'i' } }]
        });

      for (var i = 0; i < results.length; i++) {
        _ret.push(results[i].ProductName);
        _ret.push(results[i].ProductCategory);
        _ret.push(results[i].ProductDescription);
        _ret.push(results[i].ProductPrice);
        _ret.push(results[i].ContactInfo);
        _ret.push(results[i].ProductState);
        _ret.push(results[i].ProductCity);
        _ret.push(results[i].ProductCondition);
        // _ret.push( results[i]._id );
        _ret.push(results[i].ProductImages);
        _ret.push(results[i].Email)
      }
    }
    else {
      results = await Product.find() //db.collection('ProductInfo').find().toArray();

      for (var i = 0; i < results.length; i++) {
        _ret.push(results[i].ProductName);
        _ret.push(results[i].ProductCategory);
        _ret.push(results[i].ProductDescription);
        _ret.push(results[i].ProductPrice);
        _ret.push(results[i].ContactInfo);
        _ret.push(results[i].ProductState);
        _ret.push(results[i].ProductCity);
        _ret.push(results[i].ProductCondition);
        // _ret.push( results[i]._id );
        _ret.push(results[i].ProductImages);
        _ret.push(results[i].Email)
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
    var ret = { results: _ret, res: results, error: error };
    // var ret = {results:results, error:error}; // this method returns an array of objects
    res.status(200).json(ret);
  });
  
  app.post('/api/searchById', async (req, res, next) => {
      var error = '';
    
      const { _id } = req.body;
    
      var results;
    
      try{
        results = await Product.find({ "_id": _id });
        var ret = { results: results, error:error };
      }
      catch{
        var ret = {error: "No product with that id"};
      }
   
      res.status(200).json(ret);
  });
  
    app.post('/api/ownedByUser', async (req, res, next) => {
    // incoming: email
    // outgoing: results[], error

    var error = '';

    // const { email } = req.body;
    let token = require('./createJWT.js');
    const { email, jwtToken } = req.body;

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

    var results = await Product.find({"Email": email });

      var refreshedToken = null;
      try
      {
        refreshedToken = token.refresh(jwtToken);
      }
      catch(e)
      {
          console.log(e.message);
      }

    var ret = {results:results, error:error, jwtToken: refreshedToken};
    // var ret = { results: results, error: error };
    res.status(200).json(ret);
  });

  app.post('/api/addproduct', async (req, res, next) => {
    // incoming: productName, productCategory, productDescription, productPrice, contactInfo, email, 
    // outgoing: error

    // const { productName, productCategory, productDescription, productPrice, contactInfo, email } = req.body;
    let token = require('./createJWT.js');
    const {
      productName,
      productCategory,
      productCondition,
      productDescription,
      productPrice,
      city,
      state,
      images,
      contactInfo,
      email,
      ProductImages,
      jwtToken
    } = req.body;


    try {
      if (token.isExpired(jwtToken)) {
        var r = { error: 'The JWT is no longer valid', jwtToken: '' };
        res.status(200).json(r);
        return;
      }
    }
    catch (e) {
      console.log(e.message);
    }

    const newProduct = {
      ProductName: productName,
      ProductCategory: productCategory,
      ProductCondition: productCondition,
      ProductDescription: productDescription,
      ProductPrice: productPrice,
      ContactInfo: contactInfo,
      ProductCity: city,
      ProductState: state,
      ProductImages: ProductImages,
      Email: email,
      DateListed: new Date()
    };
    var error = '';

    try {
      // const db = client.db();
      // const result = db.collection('ProductInfo').insertOne(newProduct);
      const result = Product.create(newProduct);
    }
    catch (e) {
      error = e.toString();
    }

    var refreshedToken = null;
    try {
      refreshedToken = token.refresh(jwtToken);
    }
    catch (e) {
      console.log(e.message);
    }

    var ret = { error: error, jwtToken: refreshedToken };//, req:req.body
    res.status(200).json(ret);

    // var ret = { error: error };
    // res.status(200).json(ret);
  });

  app.post('/api/editproduct', async (req, res, next) => {
    // incoming: productName
    // outgoing: error

    const {
      _id,
      Email,
      ProductName,
      ProductDescription,
      ProductCategory,
      ProductPrice,
      ContactInfo,
      ProductState,
      ProductCity,
      ProductCondition,
      ProductImages
    } = req.body;

    const productToUpdate = { _id: _id, Email: Email };
    const updateInfo =
    {
      ProductName: ProductName,
      ProductDescription: ProductDescription,
      ProductCategory: ProductCategory,
      ProductPrice: ProductPrice,
      ContactInfo: ContactInfo,
      ProductState: ProductState,
      ProductCity: ProductCity,
      ProductCondition: ProductCondition,
      ProductImages: ProductImages
    };

    var error = '';

    try {
      // const db = client.db();
      // const result = db.collection('ProductInfo').updateOne(productToUpdate, updateInfo);
      const result = await Product.findOneAndUpdate(productToUpdate, updateInfo);
    }
    catch (e) {
      error = e.toString();
    }

    var ret = { error: error };
    res.status(200).json(ret);
  });

  app.post('/api/deleteproduct', async (req, res, next) => {
    // incoming: productName
    // outgoing: error

    let token = require('./createJWT.js');
    const { _id, jwtToken } = req.body;

    try {
      if (token.isExpired(jwtToken)) {
        var r = { error: 'The JWT is no longer valid', jwtToken: '' };
        res.status(200).json(r);
        return;
      }
    }
    catch (e) {
      console.log(e.message);
    }

    const deleteProduct = { _id: _id };
    var error = '';

    try {
      // const db = client.db();
      // const result = db.collection('ProductInfo').deleteOne(deleteProduct);
      const result = await Product.findOneAndDelete(deleteProduct);
    }
    catch (e) {
      error = e.toString();
    }

    var refreshedToken = null;
    try {
      refreshedToken = token.refresh(jwtToken);
    }
    catch (e) {
      console.log(e.message);
    }

    var ret = { error: error, jwtToken: refreshedToken };
    res.status(200).json(ret);
  });

  app.post('/api/editprofile', async (req, res, next) => {
    // incoming: productName
    // outgoing: error

    const { Email, FirstName, LastName, PhoneNumber } = req.body;
    
    const userToUpdate = { Email: Email };
    const updateInfo =
    {
      FirstName: FirstName,
      LastName: LastName,
      PhoneNumber: PhoneNumber,
    };

    var error = '';

    var id = -1;
    var fn = '';
    var ln = '';
    var em = '';
    var pn = '';

    var ret;

    try {
      const result = await User.findOneAndUpdate(userToUpdate, updateInfo);
    }
    catch {
      ret = {error: 'Did not find user to update'};
    }

    const results = await User.find({ Email:Email })

    if (results.length > 0)
    {
        id = results[0]._id;
        fn = FirstName;
        ln = LastName;
        em = Email;
        pn = PhoneNumber;

      try {
        const token = require("./createJWT.js");
        ret = token.createToken(fn, ln, id, em, pn);
      }
      catch (e) {
        ret = {error: e.message};
      }
    }
    else
    {
      ret = { error: "Database did not update"};
    }
    // var ret = { error: error, jwtToken: refreshedToken, fn: FirstName, ln: LastName, id: id, em: user.Email, pn: PhoneNumber };
    res.status(200).json(ret);
  });
}
