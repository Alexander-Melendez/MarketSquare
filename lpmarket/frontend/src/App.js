import './App.css';
import React, { useState } from "react";
import ReactDOM from 'react-dom';

import { BrowserRouter as Router, Route, Redirect, Switch, Link } from 'react-router-dom';
import { Button, Navbar, Card, Container, FormControl, Form, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import NewListingPage from './pages/NewListingPage';
import MakeListing from './components/MakeListing';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LoggedInName from './components/LoggedInName'
const Name = ["One", "Two", "Three", "Four", "Five", "Six", "Seven?", "Eight!", "Zero"];
const Price = [1, 2, 3, 4, 5, 6, 7, 8, 0];


function App() {
  var search = '';
  const [searchResults,setResults] = useState('');
  const[NameArray, setNameArray] = useState(Name);
  const[PriceArray, setPriceArray] = useState(Price);
  const length = NameArray.length;



  function PlacingTest() {
    function FormattedBoxesone(index) {
      const [Switch, setSwitch] = useState(false);
      return (
        <div>
          <div class="box" onClick={() => setSwitch(true)}>
            <p>Name: {NameArray[index]}</p>
            <p>Price: {PriceArray[index]}</p>
          </div>
          <div className={Switch ? "popupclass" : "hidden"} onClick={() => setSwitch(false)}>
            <p>Name: {NameArray[index]}</p>
            <p>Price: {PriceArray[index]}</p>
          </div>
        </div>
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
      <div class="container">
        {rowone}
      </div>
    );
  
  }

  
  var userId = 0;
  const searchCard = async event => 
  {
      event.preventDefault();
      
      var obj = {userId:userId,search:search.value};
      var js = JSON.stringify(obj);
      try
      {
        const response = await fetch('http://localhost:5000/api/search',
        {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});
          var txt = await response.text();
          var res = JSON.parse(txt);
          var _results = res.results;
          setNameArray(_results);
          //alert(_results);
      }
      catch(e)
      {
          alert(e.toString());
          setResults(e.toString());
      }
  };
  return (
    <Router basename='Home'>
      <div>
        <Navbar bg="dark" variant="dark" sticky="top">
            <Link to='/' style={{ textDecoration: 'none' }}><Navbar.Brand>Home</Navbar.Brand></Link>
            <Route path='/' exact>
              <Form className="d-flex">
              <FormControl type="search"  placeholder="Search.." ref={(c) => search = c}/>
              <Button variant="secondary" onClick={searchCard}>Submit</Button>
            
              </Form>
            </Route>
            <Container style={{ display: 'flex', justifyContent: 'flex-end' }} >
              <Route path='/' exact>
                {localStorage.getItem('user_data') !== null
                  ?<div><LoggedInName/></div>
                  :<><Nav.Link as={Link} to="/Register">Register</Nav.Link>
                   <Nav.Link as={Link} to="/login">Login</Nav.Link></>
                
                }
              </Route>
              <Nav.Link as={Link} to="/NewListing">Sell</Nav.Link>
            </Container>
        </Navbar>

        <Switch>
          <Route path='/' exact>
            <PlacingTest />
          </Route>
          <Route exact path='/NewListing' component={NewListingPage} />
          <Route exact path='/login' component={LoginPage} />
          <Route exact path='/register' component={RegisterPage} />
        </Switch>
      </div>
    </Router>
  );
}

//ReactDOM.render(<App />, document.getElementById('root'));
export default App;
