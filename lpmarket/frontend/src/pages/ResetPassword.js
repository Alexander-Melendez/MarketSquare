import '../App.css';
import React, { useState, useEffect } from "react";
import { useParams, Link } from 'react-router-dom';
import { Row, Col, Form, Button, Container, InputGroup, Alert, Card } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const bp = require('../Path.js');
const req = "Required field"

const passwordSchema = yup.object().shape({
    password: yup.string().min(8, "Must Contain at least 8 characters")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
            , "Must contain, one uppercase letter, one lowercase letter, one number and one special character"
        ).required(req),
    passwordTwo: yup.string().oneOf([yup.ref("password"), null], "Passwords do not match").required(req),
});


function ResetPassword() {
    let { token } = useParams()

    const [success, setSuccess] = useState(false)
    const [msg, setMsg] = useState('')
    const [passwordShown, setPasswordShown] = useState(false);
    const togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
    };

    const { register, handleSubmit, reset,
        formState: { errors, isDirty, isSubmitting, touchedFields, submitCount, ...formState }
    } = useForm({
        resolver: yupResolver(passwordSchema),
        mode: "all",
        reValidateMode: "all",
    });

    const onSubmit = async (data) => {
        var send = {  token: token, newPassword: data.password};
        console.log(send)
        try {
            const response = await fetch(bp.buildPath('api/resetPassword'),
                {
                    method: 'POST',
                    body: JSON.stringify(send),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            var txt = await response.text();
            var res = JSON.parse(txt);
            console.log(res);
            if (res.error) {
                setSuccess(false)
                setMsg(res.error)
            }
            else {
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
                    <Alert className="text-center" variant={success ? "success" : "danger"} hidden={msg === ""}>
                        {msg}<br></br>
                        {(success ? <Link to="/login" >You may now login</Link> : <p>Please try again</p>)}
                    </Alert>
                    <div className='text-center'><h1>Reset Password</h1></div>
                    <hr />
                    <Col>
                        <Form noValidate onSubmit={handleSubmit(onSubmit)} onReset={reset}>
                            <Row>
                                <Form.Group>
                                    <Form.Label>New Password</Form.Label>
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
                                <Form.Group className="mb-3">
                                    <Form.Label>Confirm New Password</Form.Label>
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
                                </Form.Group>
                                <Form.Group as={Col} className="mb-3" controlId="formControls">
                                    <Button
                                        type="submit"
                                        className="btn btn-success"
                                    >
                                        Confirm
                                    </Button>
                                </Form.Group>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </Container >
        </Container>
    )
}

export default ResetPassword