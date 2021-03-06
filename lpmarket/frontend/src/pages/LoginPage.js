import '../App.css';
import { createContext, useState, useEffect } from 'react'
import { Row, Col, Alert, Form, Button, Container, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Keeping this here as I will fix the jwt soon
import { useJwt, decodeToken } from "react-jwt";

// form validation rules 
const loginSchema = yup.object().shape({
    email: yup.string().email("example: user@site.com").required("Required"),
    password: yup.string().required("Required"),
});

function LoginPage() {

    let bp = require('../Path.js');
    const [success, setSuccess] = useState(false)
    const [msg, setMsg] = useState('')
    const [passwordShown, setPasswordShown] = useState(false);
    const togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
    };

    const { register, handleSubmit, reset,
        formState: { errors, isDirty, isSubmitting, touchedFields, submitCount, ...formState }
    } = useForm({
        resolver: yupResolver(loginSchema),
        mode: "all",
        reValidateMode: "all",
    });

    const onSubmit = async (data) => {

        // JWT Set Up WIP
        let storage = require('../tokenStorage.js');
        //let obj = {email:email,password:password.value,jwtToken:storage.retrieveToken()};
        //let js = JSON.stringify(obj)
        console.log(data)
        var send = JSON.stringify(data);
        console.log(send)
        try {
            const response = await fetch(bp.buildPath('api/login'),
                {
                    method: 'POST',
                    body: send,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            var txt = await response.text();
            var res = JSON.parse(txt);
            // console.log("Res",res)
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

            if (!res.error) {
                var tok = res.accessToken//decodeToken(res.accessToken);
                // console.log("Login Token: ", decodeToken(tok))
                storage.storeToken(tok)
                // var user = { id: ud.payload.id, firstName: ud.payload.firstName, lastName: ud.payload.lastName }

                // var user = { id: res.id, irstName: res.fn, lastName: res.ln }
                var user = { firstName: res.fn, lastName: res.ln, id: res.id, email: res.email, phoneNumber: res.pn }
                localStorage.setItem('user_data', JSON.stringify(user));
                // console.log("res", res, "Storage", localStorage.getItem('user_data'));
                // console.log("\nres:", res, "\nuserJson:", user)
                setSuccess(false)
                setMsg("")
                window.location.href = '/Home';
                // setRedirectPrev(true)

                // <Redirect to="/Home" />
            }
            else {
                console.log("API Error:" + res.error);
                setSuccess(false)
                setMsg(res.error)
            }
        }
        catch (e) {
            console.log(e.toString());
        }
    };


    // const location = useLocation()
    // if (redirectPrev === true){
    //     return <Redirect to={location.state?.from || '/'}/>
    // }

    return (
        <Container className='formOverlay'>
            <Container
                className=" justify-content-center d-flex align-items-center"
                style={{ "minHeight": "70vh" }}
            >
                <Row >

                    <div className='text-center'><h1 className='text-Center'>Login</h1></div>
                    <hr />
                    <Col>
                        <Alert className="text-center" variant={success ? "success" : "danger"} hidden={msg === ""}>
                            {msg}
                        </Alert>
                        <Form
                            noValidate
                            onSubmit={handleSubmit(onSubmit)}
                            onReset={reset}
                        // className="loginCont"
                        >
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formGridEmail">
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
                                <Form.Label>password</Form.Label>
                                <InputGroup>    
                                    <Form.Control
                                        type={passwordShown ? "text" : "password"}
                                        name="password"
                                        {...register("password")}
                                        isInvalid={!!errors.password && touchedFields.password}
                                    />
                                    <Button variant="outline-secondary" onClick={togglePasswordVisiblity}>
                                        Show
                                    </Button>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.password?.message}
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Row>
                            {/* <Form.Group as={Row} controlId="formControls"> */}
                            <Button
                                type="submit"
                                // disabled={formState.isSubmitting}
                                className="btn btn-primary">
                                {/* {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1">
                            </span>} */}
                                Login
                            </Button>
                            <Button as={Link} variant='link' to="/Register">
                                Register an Account
                            </Button>
                            <Button as={Link} variant='link' to="/ForgotPassword">
                                Forgot Password
                            </Button>
                            {/* </Form.Group> */}

                        </Form>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
}
export default LoginPage