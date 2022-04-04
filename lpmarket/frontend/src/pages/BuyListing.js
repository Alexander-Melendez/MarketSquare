import { createContext, useState, useEffect } from 'react'
import { useParams } from "react-router-dom"
import React from 'react'

function BuyListing() {
    const { id } = useParams();

    return (
        <div>BuyListing</div>
    )
}

export default BuyListing

