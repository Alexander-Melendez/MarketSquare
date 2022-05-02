import '../App.css';
import React, { useState, useEffect } from "react";
import { useParams, Link } from 'react-router-dom';
import { Row, Col, Form, Button, Container, InputGroup, Alert, Card } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const bp = require('../Path.js');
const req = "Required field"

const emailSchema = yup.object().shape({
    email: yup.string().email("example: user@site.com").required(req),
});

function ForgotPassword() {
    const [success, setSuccess] = useState(false)
    const [msg, setMsg] = useState('')
    let { token } = useParams()

    const { register, handleSubmit, reset,
        formState: { errors, isDirty, isSubmitting, touchedFields, ...formState }
    } = useForm({
        resolver: yupResolver(emailSchema),
        mode: "all",
        reValidateMode: "all",
    });

    const onSubmit = async (data) => {
        console.log(data)
        var send = JSON.stringify(data);
        // console.log("Send: " + send)
        try {
            const response = await fetch(bp.buildPath('api/forgotPassword'),
                {
                    method: 'POST',
                    body: send,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            var txt = await response.text();
            var res = JSON.parse(txt);
            // if (res.error.length > 0) {
            if (res.error) {
                // console.log("API Error:" + res.error);
                setSuccess(false)
                setMsg(res.error)
            }
            else {
                console.log(res);
                setSuccess(true)
                setMsg(res.message)
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
                style={{ "minHeight": "70vh" }}
            >
                <Row>
                    <Alert className="text-center" variant={success ? "warning" : "danger"} hidden={msg === ""}>
                        {msg}
                    </Alert>
                    <div className='text-center'><h1>Forgot Password</h1></div>
                    <hr />
                    <Col>
                        <Form noValidate onSubmit={handleSubmit(onSubmit)} onReset={reset}>
                            {/* <Row> */}
                            <Form.Label className='text-center'>Please enter the email associated with your account.</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    name="email"
                                    {...register("email")}
                                    isInvalid={!!errors.email && touchedFields.email}
                                />
                                <Button type="submit" className="btn btn-success">
                                    Submit
                                </Button>
                            </InputGroup>
                            <Form.Control.Feedback type="invalid">
                                {errors.email?.message}
                            </Form.Control.Feedback>
                            {/* </Row> */}
                        </Form>
                    </Col>
                </Row>
            </Container >
        </Container>
    )
}

export default ForgotPassword