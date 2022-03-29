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
const Name = ["One", "Two", "Three", "Four", "Five", "Six", "Seven?", "Eight!", "Zero"];
const Price = [1, 2, 3, 4, 5, 6, 7, 8, 0];
const length = Name.length;


/*
let boxloop = 0;
let counter = 0;


function getname() {
  return (Name[counter]);
}

function getprice() {
  return (Price[counter]);
}

function FormattedBoxes() {
  return(
    <div class = "box">
      <p>Name: {getname()}</p>
      <p>Price: {getprice()}</p>
    </div>
  );
}

function FormattedContainer() {
  var boxes = [];
  for (var i = 0; i < boxloop; i++) {
    boxes.push(<FormattedBoxes/>);
  }
  return ( 
    <div class = "container">
      {boxes}
    </div>
  );
}
function LoopingContainers() {
  var rowone = [];
  let numloop = (length/4);
  if(length % 4 !== 0) {
    numloop = (length/4)-1;
  }

  for (var i = 0; i < numloop; i++) {
    boxloop = 4;
    rowone.push(<FormattedContainer/>);
  }
  
  return (
    <div>
      {rowone}
    </div>
  );
}

function LoopingContainersCheck() {
  var rowtwo = [];
  boxloop = length % 4;
  if(boxloop !== 0) {
    rowtwo.push(<FormattedContainer/>);
  }
  return (
    <div>
      {rowtwo}
    </div>
  );
}

function Placinghtml() {
  return (
    <div>
      <LoopingContainers/>
      <LoopingContainersCheck/>
    </div>
  );
}
*/

//TESTING WITH REACT COMPONENTS

/*
class Conpartment extends React.Component {
  render() {
    return(
      <div>
        <PlacingTest/>
      </div>
    );
  }
}
*/

function PlacingTest() {
  const [NameArray, setNameArray] = useState(Name);
  const [PriceArray, setPriceArray] = useState(Price);

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

function App() {
  return (
    <Router basename='Home'>
      <div>
        <Navbar bg="dark" variant="dark" sticky="top">
            <Link to='/' style={{ textDecoration: 'none' }}><Navbar.Brand>Home</Navbar.Brand></Link>
            <Route path='/' exact>
              <Form className="d-flex">
              <FormControl type="search"  placeholder="Search.."/>
              <Button variant="secondary">Submit</Button>
            
              </Form>
            </Route>
            <Container style={{ display: 'flex', justifyContent: 'flex-end' }} >
              <Route path='/' exact>
                <Nav.Link as={Link} to="/Register">Register</Nav.Link>
                <Nav.Link as={Link} to="/lo gin">Login</Nav.Link>
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
