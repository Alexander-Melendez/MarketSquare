import { useState, useEffect, useRef } from 'react'

// Removed FormControl to reduce unused from 'react-bootstrap'
// import React, { useState } from "react";
import { v4 as uuid } from 'uuid';
import { Row, Col, Card, Form, Button, InputGroup, Image, CloseButton, Container } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { withRouter } from 'react-router-dom';

// form validation rules 
const req = "Required field"
const productSchema = yup.object().shape({
    productName: yup.string().required(req),
    productCategory: yup.string().required(req),
    productCondition: yup.string()
        .oneOf(["New", "Like New", "Good", "Fair", "Poor"])
        .required(req),
    productDescription: yup.string().required(req),
    city: yup.string().required(req),
    state: yup.string().required(req),
    productPrice: yup.number().positive().integer().required(req),
    images: yup.mixed().nullable().test("type", "Must be a jpeg, jpg, or png", (value) => checkIfFilesAreCorrectType(value))
        .required(req)
    // contactInfo: yup.string().required(), 
    // email: yup.string().required()
});

const formats = ['image/jpg', 'image/jpeg', 'image/png']

function checkIfFilesAreCorrectType(uploads) {
    // console.log("Upload check:" , uploads, "\nlength: ", uploads.length)
    if (uploads.length > 1) {
        for (let i = 0; i < uploads.length; i++) {
            // console.log("Upload loop Check: ", uploads[i].type)
            if (!formats.includes(uploads[i].type))
                return false
        }
    }
    else if (uploads.length === 1) {
        if (!formats.includes(uploads[0].type))
            return false
    }
    return true
}

function NewListingPage() {
    let bp = require('../Path.js');

    // Removed setValue, getValues, and errors to reduce unused errors
    const { register, handleSubmit, reset, setValue, getValues, resetField,
        formState: { errors, dirtyFields, isSubmitting, touchedFields, submitCount, ...formState }
    } = useForm({
        resolver: yupResolver(productSchema),
        mode: "onChange",
        reValidateMode: "all",
    });
    const fileInput = useRef(null)
    const [files, setFiles] = useState([]);
    const [images, setImages] = useState([]);
    const [isHovered, setHover] = useState(false);
    const [def, setDef] = useState([])

    useEffect(async () => {
        setValue("images", files, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
        let imageList = await Promise.all(files.map(async (f) => {
            const image = await readFileAsync(f)
            return image
        }))
        setImages(images => imageList);
    }, [files])

    function clearForm() {
        setFiles(def)
        reset({keepDefaultValuesk:true})
        console.log()
    }

    function handleReset() {
        const current = getValues("images")
        setFiles(current)
        setDef(files)
        reset({ "images": current }, { keepValues: true })
    }

    const handleClick = () => {
        fileInput.current.click()
    }

    async function uploadimg(e) {
        const fileList = e.target.files;

        /*var f
        if (files === null){
            f = fileList
        }
        else {
            var dt = new DataTransfer()
            for (var i = 0; i < files.length; i++) {
                dt.items.add(files[i]) 
            }
            for (var i = 0; i < fileList.length; i++) {
                dt.items.add(fileList[i])
            }
            f = dt.files
        }*/

        let imageList
        if (fileList.length > 0) {
            // imageList = await Promise.all(Array.from(fileList).map(async (f) => {
            //     const image = await readFileAsync(f)
            //     return image
            // }))

            // // update image array
            // setImages(images => [...images, ...imageList]);
            setFiles(files => [...files, ...Array.from(fileList)])

            // console.log("Before setvalue: ", getValues("images"))

            console.log("In upload: ", getValues("images"))
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

    function deleteFile(id) {
        const imageIndex = images.findIndex(item => item.id === id);

        console.log("Delete: \nfiles- ", files, "\n values: ", getValues("images"))
        if (imageIndex > -1) {
            const value = files.filter((_, i) => i !== imageIndex);
            setImages(images.filter(item => item.id !== id));
            setFiles(value);
            if (images.length === 1) {
                resetField('images');
            }
        }
        // console.log("Aftter Delete: ", files, "\n values: ", getValues("images"))
    }

    const postNewListing = async (data) => {
        console.log(data)
        var send = JSON.stringify(data);
        console.log(send)
        try {
            const response = await fetch(bp.buildPath('api/addproduct'),
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
                        <Form noValidate onSubmit={handleSubmit(postNewListing)}
                        // onReset={reset}
                        >
                            <Row className="mb-3">
                                <Form.Group>
                                    <Form.Label>Product Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="productName"
                                        {...register("productName")}
                                        isInvalid={!!errors.productName && touchedFields.productName}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.productName?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Product Category</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="productCategory"
                                        {...register("productCategory")}
                                        isInvalid={!!errors.productCategory && touchedFields.productCategory}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Product Condition</Form.Label>
                                    <Form.Control
                                        as="select"
                                        type="text"
                                        name="productCondition"
                                        {...register("productCondition")}
                                        isInvalid={!!errors.productCondition && touchedFields.productCondition}
                                    >
                                        <option value="">Select condition...</option>
                                        <option value="New">New</option>
                                        <option value="Like New">Like New</option>
                                        <option value="Good">Good</option>
                                        <option value="Fair">Fair</option>
                                        <option value="Poor">Poor</option>

                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.productCondition?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        type="text"
                                        name="productDescription"
                                        {...register("productDescription")}
                                        isInvalid={!!errors.productDescription && touchedFields.productDescription}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.productDescription?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group  >
                                    <Form.Label>Price</Form.Label>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text>$</InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            name="productPrice"
                                            {...register("productPrice")}
                                            isInvalid={!!errors.productPrice && touchedFields.productPrice}
                                        />
                                        <InputGroup.Text>.00</InputGroup.Text>
                                    </InputGroup>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.productPrice?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>City</Form.Label>
                                    <Form.Control
                                        className='mb-3'
                                        type="text"
                                        name="city"
                                        {...register("city")}
                                        isInvalid={!!errors.city && touchedFields.city}
                                    ></Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.city?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>State</Form.Label>
                                    <Form.Control
                                        className='mb-3'
                                        type="text"
                                        name="state"
                                        {...register("state")}
                                        isInvalid={!!errors.state && touchedFields.state}
                                    ></Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.state?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label htmlFor="fileUpload" onChange={uploadimg} ref={fileInput}></Form.Label>
                                    {/* <Icon style={{ fontSize: '20px'}} type="camera" /> */}
                                    <Form.Control
                                        // hidden
                                        style={{ display: 'none' }}
                                        ref={fileInput}
                                        className="mb-3"
                                        id="fileUpload"
                                        type="file"
                                        name="images"
                                        accept="image/*"
                                        multiple
                                        {...register("images", { onChange: uploadimg })}
                                        isInvalid={!!errors.images && dirtyFields.images}
                                    />
                                    <Button onClick={handleClick}>Upload Images</Button>
                                    {/* </Form.Label> */}
                                    <Form.Control.Feedback type="invalid">
                                        {errors.images?.message}
                                    </Form.Control.Feedback>
                                    <hr />
                                    {/* <Container fluid> */}
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
                                    <hr />
                                    {/* </Container> */}
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
                            {/* <Button onClick={clearForm}>CLEAR</Button> */}
                            {/* <Button onClick={handleReset}>APPLY DEFAULT</Button> */}
                        </Form>
                    </Row>
                </Card.Body>

            </Card>
        </Container>
    );
}

export default withRouter(NewListingPage)