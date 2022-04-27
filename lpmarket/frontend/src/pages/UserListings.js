import React, { useState, useEffect } from "react";
// import { BrowserRouter as Router, Route, Redirect, Switch, Link } from 'react-router-dom';

import { withRouter, useHistory } from "react-router-dom"

import ListingItem from "../components/ListingItem.js";
import EditListing from "./EditListing.js";

function UserListings() {
  
  let bp = require('../Path.js');

  const [listings, setListings] = useState(null)
  const history = useHistory()
  const onEdit = (listingId) => history.push(`/editListing/${listingId}`)
  // useEffect(async () => {
  //   var obj = { userId: JSON.parse(localStorage.getItem("user_data")).id };
  //   var js = JSON.stringify(obj);
  //   try {

  //     // subject to change
  //     const response = await fetch(bp.buildPath('api/userListings'),
  //     {
  //       method: 'POST',
  //       body: js,
  //       headers: { 'Content-Type': 'application/json' }
  //     });
  //     var txt = await response.text();
  //     var res = JSON.parse(txt);
  //     var data = res.results;
  //     let listings = []

  //   }
  //   catch (e) {
  //     alert(e.toString());
  //   }

  // }, [/*authToken*/])

  return (
    <ListingItem></ListingItem>
  )
}

export default withRouter(UserListings)