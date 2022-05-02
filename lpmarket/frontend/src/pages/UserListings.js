import '../App.css';
import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Route, Redirect, Switch, Link } from 'react-router-dom';
import { Button, Navbar, Card, Container, FormControl, Form, Nav, NavDropdown, InputGroup, Row, Col } from 'react-bootstrap';

import { withRouter, useHistory, Redirect, Link } from "react-router-dom"

import ListingItem from "../components/ListingItem.js";
import EditListing from "./EditListing.js";

let storage = require('../tokenStorage.js')
let bp = require('../Path.js');

function UserListings() {

  const [listings, setListings] = useState([])
  const history = useHistory()
  useEffect(async () => {
    var obj = {
      email: JSON.parse(localStorage.getItem("user_data")).email,
      jwtToken: storage.retrieveToken()
    };
    console.log(obj)
    var js = JSON.stringify(obj);
    try {
      const response = await fetch(bp.buildPath('api/ownedByUser'),
        { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });
      var txt = await response.text();
      var res = JSON.parse(txt);
      console.log("userlisting results: ", res)
      if (!res.error) {
        setListings(res.results)
      }
    } catch (e) {
      alert(e.toString());
      // setResults(e.toString());
    }
  }, []);

  const onEdit = (listing) => {
    (
      <Link to={{ pathname: `/EditListing/${listing._id}`, state: listing }} />
    )
  }
  // history.push(`/EditListing/${listingId}`)
  const onDelete = async (listingId) => {
    if (window.confirm('Are you sure you want to delete?')) {
      // api call
      let storage = require("../tokenStorage")
      let send = { ProductName: listingId, jwtToken: storage.retrieveToken() }
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
  let listingsLists = [1, 2, 3, 4, 5, 6, 7]
  return (
    <Container className='mainOverlay'>
      <h2 className="pb-2 text-center border-bottom">Your Listings</h2>
      <Container className='myItems' fluid>
        <Row className="justify-content-start mb-3">
          {listings.map((item) =>
            <ListingItem
              listing={item}
              key={item._id}
              id={item._id}
              onEdit={() => onEdit(item)}
              onDelete={() => onDelete(item._id)}>
            </ListingItem>)}
        </Row>
      </Container>
    </Container>
  )
}

export default withRouter(UserListings)