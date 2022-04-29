import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Route, Redirect, Switch, Link } from 'react-router-dom';
import { Button, Navbar, Card, Container, FormControl, Form, Nav, NavDropdown, InputGroup, Row, Col } from 'react-bootstrap';

import { withRouter, useHistory } from "react-router-dom"

import ListingItem from "../components/ListingItem.js";
import EditListing from "./EditListing.js";

function UserListings() {

  let bp = require('../Path.js');

  const [listings, setListings] = useState(null)
  const history = useHistory()


  useEffect(async () => {
    var obj = { userId: JSON.parse(localStorage.getItem("user_data")).id };
    var js = JSON.stringify(obj);
    /*try {
      // subject to change
      const response = await fetch(bp.buildPath('api/userListings'),
      {
        method: 'POST',
        body: js,
        headers: { 'Content-Type': 'application/json' }
      });
      var txt = await response.text();
      var res = JSON.parse(txt);
      var data = res.results;
      let listings = []
    }
    catch (e) {
      alert(e.toString());
    }*/

  }, [])

  const onEdit = (listingId) => history.push(`/EditListing/${listingId}`)
  const onDelete = async (listingId) => {
    if (window.confirm('Are you sure you want to delete?')) {
      // api call
      let storage = require("../tokenStorage")
      let send = {ProductName: listingId, jwtToken:storage.retrieveToken()}
      console.log(send)
      try {
          const response = await fetch(bp.buildPath('api/addproduct'),
              {
                  method: 'POST',
                  body: send,
                  headers: {
                      'Content-Type': 'application/json'
                  }
              });
          var txt = await response.text();
          var res = JSON.parse(txt);
          if (res.error.length > 0) {
              console.log("API Error:" + res.error);
          }
          else {
              console.log(res);
          }
      }
      catch (e) {
          console.log(e.toString());
      }
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingId
      )
      setListings(updatedListings)
    }
  } 
  
  return (
    <Container fluid>
      <Row xs={1} className="justify-content-start mb-3">
        <ListingItem onDelete onEdit/>
        <ListingItem/>
        <ListingItem/>
        <ListingItem/>
      </Row>
    </Container>

  )
}

export default withRouter(UserListings)