import '../App.css';
import { useState, useEffect } from 'react'

// Removed FormControl to reduce unused from 'react-bootstrap'
// import React, { useState } from "react";
import { v4 as uuid } from 'uuid';
import { Row, Col, Card, Form, Button, InputGroup, Image, CloseButton, Container } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { withRouter } from 'react-router-dom';

const req = "Required field"

// form validation rules 
const editSchema = yup.object().shape({
    firstName: yup.string().required(req),
    lastName: yup.string().required(req),
    phoneNumber: yup.string().matches(
        /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
        , "###-###-#### or ##########"
    ).required(req),
    // password: yup.string().min(8, "Must Contain at least 8 characters")
    //     .matches(
    //         /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
    //         , "Must contain, one uppercase letter, one lowercase letter, one number and one special character"
    //     ).required(req),
    // passwordTwo: yup.string().oneOf([yup.ref("password"), null], "Passwords do not match").required(req),
});

const oldData = JSON.parse(localStorage.getItem("user_data"))
const bp = require('../Path.js');

function EditProfile() {

    const { register, handleSubmit, reset, setValue, getValues,
        formState: { errors, isDirty, isSubmitting, touchedFields, ...formState }
    } = useForm({
        resolver: yupResolver(editSchema),
        mode: "all",
        reValidateMode: "all",
        defaultValues: oldData,
        // clone: (original) => ({ ...original })
    });

    const [passwordShown, setPasswordShown] = useState(false);

    const togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
    };



    const onSubmit = async (data) => {
        console.log(data)
        var send = JSON.stringify(data);
        console.log("Send: " + send)
        try {
            const response = await fetch(bp.buildPath('api/editprofile'),
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
                // var user =  {id:res.id,firstName:res.firstName,lastName:res.lastName}
                console.log(res);
                // localStorage.setItem('user_data', JSON.stringify(user));
                // console.log(res);
                // window.location.href = "/Home/login"
                // <Redirect to="/Home" />
            }
        }
        catch (e) {
            console.log(e.toString());
        }
    };

    return (
        <Container className='formOverlay'>
            <Container
                className="justify-content-center d-flex align-items-center"
                style={{ "minHeight": "35vh" }}
            >
                <Row>
                    <h5>Edit Profile</h5>
                    <hr />
                    <Col>
                        <Form noValidate onSubmit={handleSubmit(onSubmit)} >
                            <Row>
                                <Form.Group>
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="firstName"
                                        {...register("firstName")}
                                        isInvalid={!!errors.firstName && touchedFields.firstName}
                                    ></Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.firstName?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="lastName"
                                        {...register("lastName")}
                                        isInvalid={!!errors.lastName && touchedFields.lastName}
                                    ></Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.lastName?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className='mb-3'>
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="phoneNumber"
                                        {...register("phoneNumber")}
                                        isInvalid={!!errors.phoneNumber && touchedFields.phoneNumber}
                                    ></Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.phoneNumber?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                {
                                    /* <Form.Group>
                                        <Form.Label>Password</Form.Label>
                                        <InputGroup>
                                            <Form.Control
                                                type={passwordShown ? "text" : "password"}
                                                name="password"
                                                {...register("password")}
                                                isInvalid={!!errors.password && touchedFields.password}
                                            />
                                            <Button variant="outline-secondary"
                                                onClick={togglePasswordVisiblity}
                                            >
                                                Show
                                            </Button>
        
                                            <Form.Control.Feedback type="invalid">
                                                {errors.password?.message}
                                            </Form.Control.Feedback>
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Confirm Password</Form.Label>
                                        <InputGroup>
                                            <Form.Control
                                                type={passwordShown ? "text" : "password"}
                                                name="passwordTwo"
                                                {...register("passwordTwo")}
                                                isInvalid={!!errors.passwordTwo && touchedFields.passwordTwo}
                                            >
                                            </Form.Control>
                                            <Button variant="outline-secondary"
                                                onClick={togglePasswordVisiblity}
                                            >
                                                Show
                                            </Button>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.passwordTwo?.message}
                                            </Form.Control.Feedback>
                                        </InputGroup>
                                    </Form.Group> */
                                }
                            </Row>
                            <Form.Group as={Col} controlId="formControls">
                                <Button
                                    type="submit"
                                    disabled={formState.isSubmitting}
                                    className="btn btn-primary"
                                >
                                    {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1">
                                    </span>}
                                    Confirm
                                </Button>
                                <Button variant='danger' onClick={() => reset()}>Cancel</Button>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
}

export default EditProfile