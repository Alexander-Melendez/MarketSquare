import { createContext, useState, useEffect } from 'react'
// InputGroup and FormControl from 'react-bootstrap' removed to reduce unused errors
import { Row, Col, Card, Form, Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// Removed import { Redirect } from "react-router-dom"; to reduce unused errors
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
// Keeping this here as I will fix the jwt soon
import { useJwt, decodeToken } from "react-jwt";
// import jwt from "jsonwebtoken"
// form validation rules 
const loginSchema = yup.object().shape({
    email: yup.string().email("example: user@site.com").required("Required"),
    password: yup.string().required("Required"),
});

function LoginPage() {

    const app_name = 'marketsquare'
    function buildPath(route) {
        if (process.env.NODE_ENV === 'production') {
            return 'https://' + app_name + '.herokuapp.com/' + route;
        }
        else {
            return 'http://localhost:5000/' + route;
        }
    }



    // Removed setValue, getValues, and errors to reduce unused errors
    const { register, handleSubmit, reset,
        formState: { errors, isDirty, isSubmitting, touchedFields, submitCount, ...formState }
    } = useForm({
        resolver: yupResolver(loginSchema),
        mode: "onBlur",
        reValidateMode: "onBlur",
    });

    // const { decodedToken, isExpired } = useJwt("");
    const onSubmit = async (data) => {

        // JWT Set Up WIP
        let storage = require('../tokenStorage.js');
        //let obj = {email:email,password:password.value,jwtToken:storage.retrieveToken()};
        //let js = JSON.stringify(obj)
        console.log(data)
        var send = JSON.stringify(data);
        console.log(send)
        try {
            const response = await fetch(buildPath('api/login'),
                {
                    method: 'POST',
                    body: send,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            var txt = await response.text();
            var res = JSON.parse(txt);
            /*if (res.error.length > 0) {
                console.log("API Error:" + res.error);
            }
            else {

                storage.storeToken(res);
                // var jwt = require('jsonwebtoken'); 

                // var ud = jwt.decode(storage.retrieveToken(),{complete:true}); 
                var ud = decodeToken(storage.retrieveToken());
                // var user = { id: res.id, firstName: res.firstName, lastName: res.lastName }
                var user = { id: ud.payload.id, firstName: ud.payload.firstName, lastName: ud.payload.lastName }*/

            if (res.fn.length > 0) {
                
                storage.storeToken(res);
                // var jwt = require('jsonwebtoken'); 

                // var ud = jwt.decode(storage.retrieveToken(),{complete:true}); 
                var ud = decodeToken(storage.retrieveToken());
                // var user = { id: res.id, firstName: res.firstName, lastName: res.lastName }
                // var user = { id: ud.payload.id, firstName: ud.payload.firstName, lastName: ud.payload.lastName }
                
                var user = { id: res.id, firstName: res.fn, lastName: res.ln }
                localStorage.setItem('user_data', JSON.stringify(user));
                console.log(res, user, localStorage.getItem('user_data'));
                // window.location.href = '/Home';
                // <Redirect to="/Home" />
            }
            else {
                console.log("API Error:" + res.error);
            }
        }
        catch (e) {
            console.log(e.toString());
        }
    };

    return (
        <Container
            className="justify-content-center d-flex align-items-center"
            style={{ "min-height": "90vh" }}
        >
            {/* <Row>
            <Col md lg="4"> */}
            <Card className='mx-auto'>
                <Card.Body>
                    <h5>{'Login'}</h5>
                    <hr />
                    <Row >
                        <Col>
                            <Form noValidate onSubmit={handleSubmit(onSubmit)} onReset={reset}>
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formGridEmail">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            className='formFloating'
                                            type="text"
                                            name="email"
                                            {...register("email")}
                                            isInvalid={!!errors.email && touchedFields.email}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.email?.message}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="password"
                                            {...register("password")}
                                            isInvalid={!!errors.password && touchedFields.password}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.password?.message}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Row>
                                {/* <Form.Group as={Row} controlId="formControls"> */}
                                <Button
                                    type="submit"
                                    disabled={formState.isSubmitting}
                                    className="btn btn-primary">
                                    {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1">
                                    </span>}
                                    Login
                                </Button>
                                <Button as={Link} variant='link' to="/Register">
                                    Register an Account
                                </Button>
                                {/* </Form.Group> */}

                            </Form>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* </Col>
        </Row> */}
        </Container>
    );
}
export default LoginPage