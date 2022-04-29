import './App.css';
import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Redirect, Switch, Link } from 'react-router-dom';
import { Button, Navbar, Card, Container, FormControl, Form, Nav, NavDropdown, InputGroup, Row, Col } from 'react-bootstrap';

import NewListingPage from './pages/NewListingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EditProfile from './pages/EditProfile';
import UserListings from './pages/UserListings';
import EditListing from './pages/EditListing';

import LoggedInName from './components/LoggedInName'
import ProtectedRoute from './components/ProtectedRoute';


const Temp = [];

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
  const length = NameArray.length;

  let bp = require('./Path.js');

  useEffect(async () => {
    var obj = { userId: userId, search: search.value };
    var js = JSON.stringify(obj);
    try {
      const response = await fetch(bp.buildPath('api/search'),
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

      var resultlength = _results.length;
      for (var i = 0; i < resultlength; i = i + 8) {
        resultsName.push(_results[i]);
        resultsProductCategory.push(_results[i + 1]);
        resultsDesc.push(_results[i + 2]);
        resultsPrice.push(_results[i + 3]);
        resultContactInfo.push(_results[i + 4]);
        resultState.push(_results[i + 5]);
        resultCity.push(_results[i + 6]);
        resultCondition.push(_results[i + 7]);
      }
      setName(resultsName);
      setPrice(resultsPrice);
      setProductCategory(resultsProductCategory);
      setDesc(resultsDesc);
      setContactInfo(resultContactInfo);
      setState(resultState);
      setCity(resultCity);
      setCondition(resultCondition);
    }
    catch (e) {
      alert(e.toString());
      setResults(e.toString());
    }
  }, []);

  function PlacingTest() {
    function FormattedBoxesone(index) {
      const [Switch, setSwitch] = useState(false);
      return (
        <Col md="auto">
          <div class="box" onClick={() => setSwitch(true)}>
            <p class="Product">{NameArray[index]}</p>
            <p>Condition: {ConditionArray[index]}</p>
            <p>$ {PriceArray[index]}</p>
            <p>{ProductCategoryArray[index]}</p>
            <p>Location: {CityArray[index]} {StateArray[index]}</p>
          </div>
          <div className={Switch ? "popupclass" : "hidden"} onClick={() => setSwitch(false)}>
            <p class="Product">{NameArray[index]}</p>
            <p>Condition: {ConditionArray[index]}</p>
            <p>${PriceArray[index]}</p>
            <p> {ProductCategoryArray[index]}</p>
            <p>Location: {StateArray[index]} {CityArray[index]}</p>
            <p class="Descriptiontwo">Description</p>
            <p class="Description"> {DescArray[index]}</p>
            <p>Contact Info: {ContactInfoArray[index]}</p>
          </div>
        </Col>
      );
    }

    var rowone = [];
    let numloop = (length / 4);
    var boxes = [];
    let boxloops = 4;
    if (length % 4 !== 0) {
      numloop = (length / 4) - 1;
    }

    for (var i = 0; i < numloop; i++) {
      for (var j = 0; j < boxloops; j++) {
        boxes.push(FormattedBoxesone(i * 4 + j));
      }
    }
    for (var k = 0; k < length % 4; k++) {
      boxes.push(FormattedBoxesone(i * 4 + k));
    }
    rowone.push(boxes);

    return (
      <>
        {rowone}
      </>
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

      var resultlength = _results.length;
      for (var i = 0; i < resultlength; i = i + 8) {
        resultsName.push(_results[i]);
        resultsProductCategory.push(_results[i + 1]);
        resultsDesc.push(_results[i + 2]);
        resultsPrice.push(_results[i + 3]);
        resultContactInfo.push(_results[i + 4]);
        resultState.push(_results[i + 5]);
        resultCity.push(_results[i + 6]);
        resultCondition.push(_results[i + 7]);
      }
      setName(resultsName);
      setPrice(resultsPrice);
      setProductCategory(resultsProductCategory);
      setDesc(resultsDesc);
      setContactInfo(resultContactInfo);
      setState(resultState);
      setCity(resultCity);
      setCondition(resultCondition);
    }
    catch (e) {
      alert(e.toString());
      setResults(e.toString());
    }
  };

  return (

    <Router basename='Home'>
      {/* <div> */}
      <Navbar bg="dark" variant="dark" sticky='top'>
        <Container fluid className="justify-content-start">
          <Link to='/' style={{ textDecoration: 'none' }}><Navbar.Brand>Home</Navbar.Brand></Link>
          {/* <Navbar.Toggle aria-controls="responsive-navbar-nav" /> */}
          <Nav >
            <Route path='/' exact>
              {/* <Navbar.Collapse id="responsive-navbar-nav"> */}
              <InputGroup >
                {/* <Form className="d-flex"> */}
                <Form.Control type="search" placeholder="Search.." ref={(c) => search = c} />
                <Button variant="secondary" onClick={searchCard}>Submit</Button>
                {/* </Form> */}
              </InputGroup>
            </Route>
          </Nav>
        </Container>
        <Nav className="justify-content-end">
          <Nav.Link as={Link} to="/NewListing">Sell</Nav.Link>
          {localStorage.getItem('user_data') !== "{}"
            ?
            <Route path='/'><LoggedInName /></Route>
            :
            <Route path='/' exact>
              <Nav>
                <Nav.Link as={Link} to="/Register">Register</Nav.Link>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
              </Nav>
            </Route>
          }
        </Nav>

        {/* </Navbar.Collapse> */}
        {/* </Route> */}
      </Navbar>

      <Switch>
        <Route path='/' exact>
          <Container fluid>
            <Row className="justify-content-start mb-3">
              {/* <body > */}
                {/* <main > */}
                  <PlacingTest />
                {/* </main> */}
              {/* </body> */}
            </Row>
          </Container>
        </Route>
        {/* <Route exact path='/NewListing' component={NewListingPage} /> */}
        <ProtectedRoute exact path='/NewListing' component={NewListingPage} />
        <ProtectedRoute exact path='/UserListings' component={UserListings} />
        <ProtectedRoute exact path='/EditProfile' component={EditProfile} />
        <Route exact path='/login' component={LoginPage} />
        <Route exact path='/register' component={RegisterPage} />
        <Route path='/EditListing/:listingId' element={<EditListing />} />
      </Switch>
      {/* </div> */}
    </Router >

  );
}

//ReactDOM.render(<App />, document.getElementById('root'));
export default App;
