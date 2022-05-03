import '../App.css';
import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Route, Redirect, Switch, Link } from 'react-router-dom';
import { Button, Container, Row, Col, Carousel } from 'react-bootstrap';

import { withRouter, Redirect, Link } from "react-router-dom"

import ListingItem from "../components/ListingItem.js";
import EditListing from "./EditListing.js";

let storage = require('../tokenStorage.js')
let bp = require('../Path.js');

function UserListings() {

  const [listings, setListings] = useState([])
  useEffect(async () => {
    var obj = {
      email: JSON.parse(localStorage.getItem("user_data")).email,
      jwtToken: storage.retrieveToken()
    };
    console.log("Send", obj)
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

  const onDelete = async (listing) => {
    if (window.confirm('Are you sure you want to delete?')) {
      // api call
      let storage = require("../tokenStorage")
      let send = { _id: listing._id, jwtToken: storage.retrieveToken() }
      console.log(send)
      try {
        const response = await fetch(bp.buildPath('api/deleteproduct'),
          {
            method: 'POST',
            body: JSON.stringify(send),
            headers: {
              'Content-Type': 'application/json'
            }
          });
        var txt = await response.text();
        var res = JSON.parse(txt);
        console.log("From Delete", res);
        if (res.error !== "") {

        }
        else {
          const updatedListings = listings.filter((item) => item._id !== listing._id)
          setListings(updatedListings)
          console.log(res);
          window.location.href = '/Home/UserListings';
        }
      }
      catch (e) {
        console.log(e.toString());
      }
    }
  }

  return (
    <Container className='mainOverlay'>
      <h2 className="pb-2 text-center border-bottom">Your Listings</h2>
      <Container className='myItems' fluid>
        <Row className="justify-content-start mb-3" style={{ alignItems: "stretch" }}>
          {listings.map((item) =>
            <ListingItem
              listing={item}
              key={item._id}
              id={item._id}
              onEdit={() => onEdit(item)}
              onDelete={() => onDelete(item)}>
            </ListingItem>)}
        </Row>
      </Container>
    </Container>
  )
}

export default withRouter(UserListings)