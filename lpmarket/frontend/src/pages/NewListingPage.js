// import { createContext, useState, useEffect } from 'react'

// Removed FormControl to reduce unused from 'react-bootstrap'
import React, { useState } from "react";
import { v4 as uuid } from 'uuid';
import { Row, Col, Card, Form, Button, InputGroup, Image, CloseButton, Container } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// import ImgThumbs from '../components/ImgThumbs';

// form validation rules 
const schema = yup.object().shape({
    productName: yup.string().required(),
    productCategory: yup.string().required(),
    productDescription: yup.string().required(),
    city: yup.string().required(),
    state: yup.string().required(),
    productPrice: yup.number().positive().integer().required(),
    images: yup.mixed()
        .required()
        .test("fileType", "Unsupported File Format", (value) =>
            ["image/jpeg", "image/png", "image/jpg"].includes(value.type))
    // contactInfo: yup.string().required(), 
    // email: yup.string().required()
});

const app_name = 'marketsquare'
function buildPath(route) {
    if (process.env.NODE_ENV === 'production') {
        return 'https://' + app_name + '.herokuapp.com/' + route;
    }
    else {
        return 'http://localhost:5000/' + route;
    }
}

function NewListingPage() {

    // Removed setValue, getValues, and errors to reduce unused errors
    const { register, handleSubmit, reset, formState, setValue, getValues, resetField } = useForm({
        resolver: yupResolver(schema),
    });

    const [files, setFiles] = useState([]);
    const [images, setImages] = useState([]);
    const [isHovered, setHover] = useState(false);

    async function uploadimg(e) {
        console.log(e.target.files)
        const fileList = e.target.files;
        // const imageList = []

        // for (let i = 0; i < fileList.length; i++) {
        //     imageList.push(await readFileAsync(fileList[i]))
        // }
        const imageList = await Promise.all(Array.from(fileList).map(async (f) => {
            const image = await readFileAsync(f)
            return image
        }))

        if (fileList) {


            setImages(images => [...images, ...imageList]);
            setFiles(files => [...files, ...fileList])
            // setValue('images', files);
            console.log("e---image", files, images);
        }
    }

    function readFileAsync(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                resolve({
                    id: uuid(),
                    url: reader.result,
                    type: "image"
                });
            };

            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    function handleSaveImage() {
        console.log(files);
    }

    function deleteFile(id) {
        const imageIndex = images.findIndex(item => item.id === id);

        if (imageIndex > -1) {
            const value = files.filter((_, i) => i !== imageIndex);
            setImages(images.filter(item => item.id !== id));
            setFiles(value);
            if (images.length === 1) {
                resetField('images');
            }
            // setValue("images", value);
        }
    }

    const onSubmit = async (data) => {
        console.log(data)
        var send = JSON.stringify(data);
        console.log(send)
        try {
            const response = await fetch(buildPath('api/addproduct'),
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
                console.log(res);
            }
        }
        catch (e) {
            console.log(e.toString());
        }
    };

    return (
        <Container fluid>
            <Card>
                <Card.Body>
                    <Row>
                        <Col><Card.Title>Create New Listing</Card.Title></Col>
                        <Col>
                        </Col>
                    </Row>
                    <hr />
                    <Row>
                        <Form noValidate onSubmit={handleSubmit(onSubmit)} onReset={reset}>
                            <Row className="mb-3">
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
                                <Form.Group  >
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
                                    <Form.Group as={Col}>
                                        <Form.Label>City</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="city"
                                            {...register("city")}
                                        ></Form.Control>
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>State</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="state"
                                            {...register("state")}
                                        ></Form.Control>
                                    </Form.Group>
                                <Form.Group>
                                    <Form.Label></Form.Label>
                                    {/* <Row> */}
                                    <Form.Control
                                        type="file"
                                        name="images"
                                        multiple
                                        {...register("images", { onChange: uploadimg })}
                                    />
                                    {/* </Row> */}
                                    <Row>
                                        <Container fluid>
                                            <Row 
                                            className="justify-content-start mb-3" xs="auto"
                                            
                                            >
                                                {images.map((media) => (
                                                    <Col
                                                        key={media.id}
                                                        onMouseOver={() => setHover(true)}
                                                        onMouseLeave={() => setHover(false)}
                                                        style={{
                                                            position: 'relative',
                                                            maxWidth: '150px',
                                                            maxHeight: '150px'
                                                        }}
                                                        // xs
                                                    >
                                                        <Image
                                                            fluid
                                                            // thumbnail
                                                            src={media.url}
                                                            // alt="product"
                                                            key={media.id}
                                                            style={{
                                                                maxWidth: '100%',
                                                                maxHeight: '100%'
                                                            }}
                                                        />
                                                        {isHovered && (
                                                            <Button
                                                                variant="secondary" 
                                                                size="sm"
                                                                style={{
                                                                    position: 'absolute',
                                                                    left: 0,
                                                                    right: 0,
                                                                    top: 0,
                                                                    bottom: 0
                                                                }}
                                                                onClick={() => deleteFile(media.id)}
                                                            >Remove</Button>
                                                        )}
                                                    </Col>
                                                ))}
                                            </Row>
                                        </Container>
                                    </Row>
                                </Form.Group>

                            </Row>
                            {/* <Form.Group controlId="formControls" > */}
                            <Button
                                type="submit"
                                disabled={formState.isSubmitting}
                                className="justify-content-start btn btn-primary">
                                {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1">
                                </span>}
                                Create
                            </Button>
                            {/* </Form.Group> */}

                        </Form>
                    </Row>
                </Card.Body>

            </Card>
        </Container>
    );
}

export default NewListingPage