// import { createContext, useState, useEffect } from 'react'
// InputGroup and FormControl from 'react-bootstrap' removed to reduce unused errors
import { Row, Col, Card, Form, Button, Container } from 'react-bootstrap';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const req = "Required field"

// form validation rules 
const registerSchema = yup.object().shape({
    firstName: yup.string().required(req),
    lastName: yup.string().required(req),
    email: yup.string().email("example: user@site.com").required(req),
    phoneNumber: yup.string().matches(
        /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
        , "###-###-#### or ##########"
    ).required(req),
    password: yup.string().min(8, "Must Contain at least 8 characters")
        .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
        , "Must contain, one uppercase letter, one lowercase letter, one number and one special character"
    ).required(req),
    passwordTwo: yup.string().oneOf([yup.ref("password"), null], "Passwords do not match").required(req),
});

function RegisterPage() {

    const { register, handleSubmit, reset, setValue, getValues,
        formState: { errors, isDirty, isSubmitting, touchedFields, submitCount, ...formState }
    } = useForm({
        resolver: yupResolver(registerSchema),
        mode: "onBlur",
        reValidateMode: "onBlur",
    });

    const onSubmit = async (data) => {
        console.log(data)
        var send = JSON.stringify(data);
        console.log("Send: " + send)
        try {
            const response = await fetch('http://localhost:5000/api/register',
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
                window.location.href = "/Home/login"
                // <Redirect to="/Home" />
            }
        }
        catch (e) {
            console.log(e.toString());
        }
    };

    return (
        <Container>
            <Card>
                <Card.Body>
                    <h5>{"Register"}</h5>
                    <hr />
                    <Row>
                        <Col>
                            <Form noValidate onSubmit={handleSubmit(onSubmit)} onReset={reset}>
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
                                    <Form.Group >
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
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
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="password"
                                            {...register("password")}
                                            isInvalid={!!errors.password && touchedFields.password}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.password?.message}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Confirm Password</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="passwordTwo"
                                            {...register("passwordTwo")}
                                            isInvalid={!!errors.passwordTwo && touchedFields.passwordTwo}
                                        >
                                        </Form.Control>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.passwordTwo?.message}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group>
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
                                </Row>
                                <Form.Group as={Col} controlId="formControls">
                                    <Button
                                        type="submit"
                                        disabled={formState.isSubmitting}
                                        className="btn btn-primary">
                                        {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1">
                                        </span>}
                                        Register
                                    </Button>
                                </Form.Group>
                            </Form>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
}
export default RegisterPage