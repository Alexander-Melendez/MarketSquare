import '../App.css';
import React, { useState, useEffect } from "react";
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { useJwt, decodeToken } from "react-jwt";

let bp = require('../Path.js');

function ActivateEmail() {
    const [success, setSuccess] = useState(false)
    const [msg, setMsg] = useState('')
    let { token } = useParams()

    useEffect(async () => {
        // console.log("Email Token", token)

        var obj = {
            token: token
        };
        console.log("Email Token", obj)
        var js = JSON.stringify(obj);
        try {
            const response = await fetch(bp.buildPath('api/activateAccount'),
                { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            var txt = await response.text();
            var res = JSON.parse(txt);
            console.log("Email Activation results: ", res)
            if (res.error !== "No Errors, Signup Successful!") {
                console.log("API Error:" + res.error);
                setSuccess(false)
                setMsg(res.error)
            }
            else {
                
                setSuccess(true)
                setMsg(res.error)
                // console.log("success:", success, "Message:", res.error)
                // var user =  {id:res.id,firstName:res.firstName,lastName:res.lastName}
                // localStorage.setItem('user_data', JSON.stringify(user));
                // console.log(res);
                // window.location.href = "/Home/login"
                // <Redirect to="/Home" />
            }
        }
        catch (e) {
            console.log(e.toString());
        }
    }, [])

    return (
        <Container className='formOverlay'>
            <Container
                className="justify-content-center d-flex align-items-center"
            style={{ "minHeight": "70vh" }}
            >
                <Row>
                    <Alert className="text-center" variant={success ? "success" : "danger"} hidden={msg === ""}>
                        {msg}<br></br>
                        {(success ?  <Link to="/login" >You may now login</Link> : <p>Please try again</p>)}
                    </Alert>
                </Row>
            </Container >
        </Container>
    )
}

export default ActivateEmail