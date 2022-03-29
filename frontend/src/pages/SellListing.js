import { createContext, useState, useEffect } from 'react'
import { useParams, useHistory } from "react-router-dom"

// needs to redirect on login token timeout
// can only be dipslayed to seller

function SellListing({ token }) {
    
    const history = useHistory();

    // redirect on timeout
    useEffect(() => {
        if (!token) {
            history.push("/")
        }
    }, [token, history])


    const { id } = useParams();

    return (
        <div>SellListing</div>
    )
}

export default SellListing
