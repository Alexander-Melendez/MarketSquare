import './App.css';
import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Redirect, Switch, Link } from 'react-router-dom';
import { Button, Navbar, Card, Container, FormControl, Form, Nav, NavDropdown, InputGroup, Row, Col } from 'react-bootstrap';
import fbStorage from './firebase.js';

import NewListingPage from './pages/NewListingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EditProfile from './pages/EditProfile';
import UserListings from './pages/UserListings';
import EditListing from './pages/EditListing';

import ListingItem from './components/ListingItem';
import LoggedInName from './components/LoggedInName'
import ProtectedRoute from './components/ProtectedRoute';

const Temp = [];
const image = ['https://assets-global.website-files.com/5e78ee1f2f0ca263f9b67c56/5f04a4babe7bb91e10639f9a_ssat-at-home01%402x.png', 'https://assets-global.website-files.com/5e78ee1f2f0ca263f9b67c56/5f04a4babe7bb91e10639f9a_ssat-at-home01%402x.png'];
const image2 = [image, image, image, image, image, image];

function App() {
  var search = '';
  const [searchResults, setResults] = useState('');
  const [NameArray, setName] = useState(Temp);
  const [PriceArray, setPrice] = useState(Temp);
  const [ProductCategoryArray, setProductCategory] = useState(Temp);
  const [ContactInfoArray, setContactInfo] = useState(Temp);
  const [DescArray, setDesc] = useState(Temp);
  const [StateArray, setState] = useState(Temp);
  const [CityArray, setCity] = useState(Temp);
  const [ConditionArray, setCondition] = useState(Temp);
  const [ImageArray, setImage] = useState(image);

  const [counter, setCounter] = useState(0);
  let displaynumber = 4;


  let bp = require('./Path.js');

  useEffect(async () => {
    var obj = { userId: userId, search: search.value };
    var js = JSON.stringify(obj);
    try {
      const response = await fetch(bp.buildPath('api/search'),
        { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });
      var txt = await response.text();
      var res = JSON.parse(txt);
      console.log(res)
      var _results = res.results;
      var resultsName = [];
      var resultsProductCategory = [];
      var resultsDesc = [];
      var resultsPrice = [];
      var resultContactInfo = [];
      var resultState = [];
      var resultCity = [];
      var resultCondition = [];
      var resultImage = [];

      var resultlength = _results.length;
      for (var i = 0; i < resultlength; i = i + 9) {
        resultsName.push(_results[i]);
        resultsProductCategory.push(_results[i + 1]);
        resultsDesc.push(_results[i + 2]);
        resultsPrice.push(_results[i + 3]);
        resultContactInfo.push(_results[i + 4]);
        resultState.push(_results[i + 5]);
        resultCity.push(_results[i + 6]);
        resultCondition.push(_results[i + 7]);
        resultImage.push(_results[i + 8]);
      }
      setName(resultsName);
      setPrice(resultsPrice);
      setProductCategory(resultsProductCategory);
      setDesc(resultsDesc);
      setContactInfo(resultContactInfo);
      setState(resultState);
      setCity(resultCity);
      setCondition(resultCondition);
      setImage(resultImage);
    }
    catch (e) {
      alert(e.toString());
      setResults(e.toString());
    }
  }, []);


  function PlacingTest() {
    const [currentlength, setLength] = useState(NameArray.length);
    const [Switching, setSwitching] = useState(true);
    function Next() {
      if (currentlength > displaynumber * (counter + 1)) {
        setCounter(counter + 1)
      }
    }

    function Prev() {
      if (counter > 0) {
        setCounter(counter - 1)
      }
    }
    function FormattedBoxesone(index) {
      const [Switch, setSwitch] = useState(false);
      function TrueSwitch() {
        setSwitch(true)
        setSwitching(false)
      }
      function FalseSwitch() {
        setSwitch(false)
        setSwitching(true)
      }
      function imagearray(index) {
        if (ImageArray[index] == undefined) {
          return (
            <div class="bigimg">
              <img src={ImageArray[index]} alt={"No image was uploaded by the user"} />
            </div>
          );

        }
        else {
          const currentimage = Object.values(ImageArray[index]);
          return (
            <Col>
              <div class="bigimgtwo">
                {currentimage.map((i) => <img src={i} alt={"No image was uploaded by the user"} />)}
              </div>
            </Col>
          );
        }
      }
      return (<>        <Col md="auto">
          <div className={Switching ? "box" : "hidden"} onClick={TrueSwitch}>
            <p></p>
            <div className="smallimg">
              <img src={ImageArray[index]} alt={"No image was uploaded by the user"} />
            </div>
            <p className="Product">{NameArray[index]}</p>
            <p>Catagory:{ProductCategoryArray[index]}</p>
            <p>Price: $ {PriceArray[index]}</p>
            <p>Condition: {ConditionArray[index]}</p>
            <p>Location: {CityArray[index]} {StateArray[index]}</p>
          </div>
          </Col >
          <Container fluid className={Switch ? "OpenPage" : "hidden"}>
            <div onClick={FalseSwitch}>X</div>
            {/* <div>             */}
            {/* <Container fluid> */}

            {/* </Container> */}
            {/* </div> */}
            <p className="Product">{NameArray[index]}</p>
            <Row className="justify-content-start mb-3">
                <Col 
                // className="alignment"
                >
                  <p className="Descriptiontwo">Description</p>
                  <p className="Description"> {DescArray[index]}</p>
                  <p>Price: ${PriceArray[index]}</p>
                  <p>Condition: {ConditionArray[index]}</p>
                  <p>Location: {StateArray[index]} {CityArray[index]}</p>
                  <p>Contact Info: {ContactInfoArray[index]}</p>
                </Col>
            </Row>
            <Row className="justify-content-start mb-3">
              {imagearray(index)}
            </Row>
          </Container>
          </>

      );
    }

    var rowone = [];
    let numloop = (currentlength / 4);
    var boxes = [];
    let boxloops = 4;
    if (currentlength > displaynumber * (counter + 1)) {
      numloop = displaynumber / 4
      for (var i = 0; i < numloop; i++) {
        for (var j = 0; j < boxloops; j++) {
          boxes.push(FormattedBoxesone((i * 4 + j) + (counter * displaynumber)));
        }
      }
    }
    else {
      numloop = (currentlength / 4) - ((displaynumber / 4) * counter)
      if (currentlength % 4 !== 0) {
        numloop = numloop - 1;
      }
      var a = 0
      for (a = 0; a < numloop; a++) {
        for (var b = 0; b < boxloops; b++) {
          boxes.push(FormattedBoxesone((a * 4 + b) + (counter * displaynumber)));
        }
      }
      for (var k = 0; k < currentlength % 4; k++) {
        boxes.push(FormattedBoxesone((a * 4 + k) + (counter * displaynumber)));
      }
    }


    rowone.push(boxes);

    return (
      <Container className='mainOverlay'>
        <Container fluid>
          <Row className="justify-content-start mb-3">
            {rowone}
          </Row>
        </Container>
        <div class={Switching ? "navbutton" : "hidden"} >
          <button onClick={Prev}>Prev</button>  <button onClick={Next}>Next</button>
        </div>
      </Container>
    );
  }

  var userId = 0;
  const searchCard = async event => {
    event.preventDefault();
    var obj = { userId: userId, search: search.value };
    var js = JSON.stringify(obj);
    try {
      const response = await fetch('http://localhost:5000/api/search',
        { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });
      var txt = await response.text();
      var res = JSON.parse(txt);
      var _results = res.results;
      var resultsName = [];
      var resultsProductCategory = [];
      var resultsDesc = [];
      var resultsPrice = [];
      var resultContactInfo = [];
      var resultState = [];
      var resultCity = [];
      var resultCondition = [];
      var resultImage = [];

      var resultlength = _results.length;
      for (var i = 0; i < resultlength; i = i + 9) {
        resultsName.push(_results[i]);
        resultsProductCategory.push(_results[i + 1]);
        resultsDesc.push(_results[i + 2]);
        resultsPrice.push(_results[i + 3]);
        resultContactInfo.push(_results[i + 4]);
        resultState.push(_results[i + 5]);
        resultCity.push(_results[i + 6]);
        resultCondition.push(_results[i + 7]);
        resultImage.push(_results[i + 8]);
      }
      setName(resultsName);
      setPrice(resultsPrice);
      setProductCategory(resultsProductCategory);
      setDesc(resultsDesc);
      setContactInfo(resultContactInfo);
      setState(resultState);
      setCity(resultCity);
      setCondition(resultCondition);
      setImage(resultImage);
      setCounter(0);
    }
    catch (e) {
      alert(e.toString());
      setResults(e.toString());
    }
  };

  return (
    <Router basename='Home'>
      <Navbar bg="dark" variant="dark" sticky='top'>
        <Container fluid className="justify-content-start">
          <Link to='/' style={{ textDecoration: 'none' }}><Navbar.Brand>Home</Navbar.Brand></Link>
          <Nav >
            <Route path='/' exact>
              <InputGroup >
                <Form.Control type="search" placeholder="Search.." ref={(c) => search = c} />
                <Button variant="secondary" onClick={searchCard}>Submit</Button>
              </InputGroup>
            </Route>
          </Nav>
        </Container>
        <Nav className="justify-content-end">
          <Nav.Link as={Link} to="/NewListing">Sell</Nav.Link>
          {localStorage.getItem('user_data') !== null
            ?
            <Route path='/'><LoggedInName /></Route>
            :
            <Nav>
              <Nav.Link as={Link} to="/Register">Register</Nav.Link>
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
            </Nav>
          }
        </Nav>
      </Navbar>

      <Switch >
        <Route path='/' exact component={PlacingTest} />
        {/* <Route path='/' exact component={PlacingTest} /> */}
        <ProtectedRoute exact path='/UserListings' component={UserListings} />
        <ProtectedRoute exact path='/NewListing' component={NewListingPage} />
        <ProtectedRoute exact path='/EditProfile' component={EditProfile} />
        <Route exact path='/EditListing/:listingId'
          render={(props) => <EditListing {...props} />}
        // component={EditListing} 
        />
        <Route exact path='/login' component={LoginPage} />
        <Route exact path='/register' component={RegisterPage} />
      </Switch>
    </Router >
  );
}

//ReactDOM.render(<App />, document.getElementById('root'));
export default App;
