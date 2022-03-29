// import { createContext, useState, useEffect } from 'react'
import { Row, Col, Card, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import ImgThumbs from '../components/ImgThumbs';

// form validation rules 
const schema = yup.object().shape({
    productName: yup.string().required(),
    productCategory: yup.string().required(),
    productDescription: yup.string().required(),
    productPrice: yup.number().positive().integer().required(),
    images: yup.mixed().required()
        .test("fileType", "Unsupported File Format", (value) =>
                ["image/jpeg", "image/png", "image/jpg"].includes(value.type))
    // contactInfo: yup.string().required(), 
    // email: yup.string().required()
});

function NewListingPage() {

    const { register, handleSubmit, reset, setValue, getValues, errors, formState } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        console.log(data)
        var send = JSON.stringify(data);
        console.log(send)
        try {
            const response = await fetch('http://localhost:5000/api/addproduct',
                {
                    method: 'POST',
                    body: send,
                    headers: {
                        'Content-Type':'application/json'
                    }
                });
            var txt = await response.text();
            var res = JSON.parse(txt);
            if (res.error.length > 0) {
                console.log("API Error:" + res.error);
            }
            else {
                console.log(res);
            }
        }
        catch (e) {
            console.log(e.toString());
        }
    };

    return (
        <Card>
            <Card.Body>
                <h5>{'Create New Listing'}</h5>
                <hr />
                <Row>
                    <Col>
                        <Form noValidate onSubmit={handleSubmit(onSubmit)} onReset={reset}>
                            <Row>
                                <Form.Group>
                                    <Form.Label>Product Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="productName"
                                        {...register("productName")}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Product Category</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="productCategory"
                                        {...register("productCategory")}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        type="text"
                                        name="productDescription"
                                        {...register("productDescription")}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Price</Form.Label>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text>$</InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            name="productPrice"
                                            {...register("productPrice")}
                                        />
                                        <InputGroup.Text>.00</InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGridEmail">
                                    {/* <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="email"
                                        {...register("email")}
                                        // isInvalid={errors.email}
                                        // className={`form-control ${errors.email ? 'is-invalid' : ''}`}

                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {/* {errors.email?.message}
                                    </Form.Control.Feedback> */}
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label></Form.Label>
                                    <Form.Control type="file" name="images" multiple
                                        {...register("images", {onChange: (e) => ImgThumbs(e.target.files)})}
                                    ></Form.Control>
                                </Form.Group>
                            </Row>
                            <Form.Group as={Col} controlId="formControls">
                                <Button
                                    type="submit"
                                    disabled={formState.isSubmitting}
                                    className="btn btn-primary">
                                    {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1">
                                    </span>}
                                    Create
                                </Button>
                            </Form.Group>
                        </Form>
                        <ImgThumbs/>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

export default NewListingPage