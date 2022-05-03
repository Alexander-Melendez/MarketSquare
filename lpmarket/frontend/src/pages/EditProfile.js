import '../App.css';
import { useState, useEffect } from 'react'

import { Row, Col, Form, Button, InputGroup, Container, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const req = "Required field"

// form validation rules 
const editSchema = yup.object().shape({
    FirstName: yup.string().required(req),
    LastName: yup.string().required(req),
    PhoneNumber: yup.string().matches(
        /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
        , "###-###-#### or ##########"
    ).required(req),
    Password: yup.string().min(8, "Must Contain at least 8 characters")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
            , "Must contain, one uppercase letter, one lowercase letter, one number and one special character"
        ).required(req),
    // passwordTwo: yup.string().oneOf([yup.ref("password"), null], "Passwords do not match").required(req),
});

function EditProfile() {
    const stored = JSON.parse(localStorage.getItem("user_data"))
    const oldData = { LastName: stored.lastName, FirstName: stored.firstName, PhoneNumber: stored.phoneNumber }
    const bp = require('../Path.js');
    let storage = require('../tokenStorage.js');

    const { register, handleSubmit, reset,
        formState: { errors, isDirty, isSubmitting, touchedFields, ...formState }
    } = useForm({
        resolver: yupResolver(editSchema),
        mode: "all",
        reValidateMode: "all",
        defaultValues: oldData,
    });

    const [passwordShown, setPasswordShown] = useState(false);
    const [success, setSuccess] = useState(false)
    const [msg, setMsg] = useState('')

    const togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
    };

    const onSubmit = async (data) => {
        let send = {
            ...data,
            // jwtToken: storage.retrieveToken(),
            Email: stored.email
        }
        // console.log("Formdata:", data)
        // console.log("Stored", stored)
        console.log("Send: ", send)
        try {
            const response = await fetch(bp.buildPath('api/editprofile'),
                {
                    method: 'POST',
                    body: JSON.stringify(send),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            var txt = await response.text();
            var res = JSON.parse(txt);
            console.log(res)
            if (!res.error) {
                var tok = res.accessToken
                storage.storeToken(tok)
                var user = { firstName: res.fn, lastName: res.ln, id: res.id, email: res.email, phoneNumber: res.pn }
                localStorage.setItem('user_data', JSON.stringify(user));
                setSuccess(true)
                setMsg("Changes successful!")
                // window.location.href = '/Home/EditProfile';
            }
            else {
                setSuccess(false)
                setMsg("Changes unsuccessful, please try again.")
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
                                        name="FirstName"
                                        {...register("FirstName")}
                                        isInvalid={!!errors.FirstName && touchedFields.FirstName}
                                    ></Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.FirstName?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="LastName"
                                        {...register("LastName")}
                                        isInvalid={!!errors.LastName && touchedFields.LastName}
                                    ></Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.LastName?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className='mb-3'>
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="PhoneNumber"
                                        {...register("PhoneNumber")}
                                        isInvalid={!!errors.PhoneNumber && touchedFields.PhoneNumber}
                                    ></Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.PhoneNumber?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type={passwordShown ? "text" : "password"}
                                            name="Password"
                                            {...register("Password")}
                                            isInvalid={!!errors.Password && touchedFields.Password}
                                        />
                                        <Button variant="outline-secondary"
                                            onClick={togglePasswordVisiblity}
                                        >
                                            Show
                                        </Button>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.Password?.message}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>
                                {/* <Form.Group>
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
                                </Form.Group> */}

                                <Form.Group as={Col} controlId="formControls" className="mb-3">
                                    <Button
                                        type="submit"
                                        disabled={formState.isSubmitting}
                                        className="btn btn-primary"
                                    >
                                        {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1">
                                        </span>}
                                        Confirm
                                    </Button>
                                    <Button variant='warning' onClick={() => reset()}>Reset</Button>
                                </Form.Group>
                            </Row>
                        </Form>
                        <Alert className="text-center" variant={success ? "success" : "danger"} hidden={msg === ""}>
                            {msg}
                        </Alert>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
}

export default EditProfile