import '../App.css';
import { useState, useEffect, useRef } from 'react'
import storage from '../firebase.js';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { v4 as uuid } from 'uuid';
import { Row, Col, Card, Form, Button, InputGroup, Image, ButtonGroup, Container } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { withRouter, useLocation } from 'react-router-dom';

// form validation rules 
const req = "Required field"
const productSchema = yup.object().shape({
    ProductName: yup.string().required(req),
    ProductCategory: yup.string().required(req),
    ProductCondition: yup.string()
        .oneOf(["New", "Like New", "Good", "Fair", "Poor"])
        .required(req),
    ProductDescription: yup.string().required(req),
    ProductCity: yup.string().required(req),
    ProductState: yup.string().required(req),
    ProductPrice: yup.number().positive().integer().required(req),
    images: yup.mixed().nullable()
        .test("type", "jpeg/jpg/png",
            (value) => checkIfFilesAreCorrectType(value)),
    contactInfo: yup.string().matches(
        /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
        , "###-###-#### or ##########"
    ).required(req),
    email: yup.string().email("example: user@site.com").required(req)
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
let bp = require('../Path.js');
let tokenStorage = require('../tokenStorage.js')

function EditListing() {

    const location = useLocation()
    const { listing } = location.state

    // Removed setValue, getValues, and errors to reduce unused errors
    const { register, handleSubmit, reset, setValue, getValues, resetField,
        formState: { errors, dirtyFields, isSubmitting, touchedFields, submitCount, ...formState }
    } = useForm({
        resolver: yupResolver(productSchema),
        mode: "all",
        reValidateMode: "all",
        defaultValues: listing
    });
    const fileInput = useRef(null)
    const [oldImages, setOldImages] = useState([])
    const [files, setFiles] = useState([]);
    const [images, setImages] = useState([]);
    const [isHovered, setHover] = useState(false);

    const handleClick = () => fileInput.current.click()
    // Get old data to display on initial form
    // useEffect(() => {

    //     userService.getById(id).then(user => {
    //         setOldInfo(user)
    //         fields.forEach(field => setValue(field, user[field]));
    //         setFiles("images", user["images"])
    //     });

    // }, []);

    // // 

    useEffect(() => {
        console.log("Init listing data:", listing)
        if (listing.ProductImages)
            setOldImages(listing.ProductImages.map((image) => ({ url: image, id: uuid() })))
    }, [])

    useEffect(() => {
        setImages(oldImages)
        setFiles([])
        // console.log("OldImgUseEff:", oldImages)
    }, [oldImages])

    // updates images on file change
    useEffect(async () => {
        // console.log("fileUseEff:", files)
        setValue("images", files, { shouldValidate: true, shouldDirty: true, shouldTouch: true })
        let imageList = await Promise.all(files.map(async (f) => {
            const image = await readFileAsync(f)
            return image
        }))
        setImages([...images, ...imageList]);
    }, [files])

    // useEffect(() => {
    //     console.log("ImgUseEff:", images)
    // }, [images])

    // resets the form, new files list, and images
    function resetForm() {
        setFiles([])
        setImages(oldImages)
        // console.log("reset: oldimages", oldImages)
        reset()
    }

    function deleteFile(id) {
        const imageIndex = images.findIndex(item => item.id === id);
        const fileIndex = files.findIndex(item => item.id === id);

        // console.log("Delete: \nfiles- ", files, "\n values: ", getValues("images"))
        if (fileIndex > -1 && imageIndex > -1) {
            const values = files.filter((_, i) => i !== fileIndex);
            // values.length === files.length? 
            // setImages(images.filter(item => item.id !== id)): 
            setFiles(values)
            if (files.length === 1) {
                resetField('images');
            }
        }
        else if (fileIndex < 0 && imageIndex > -1) {
            setImages(images.filter(item => item.id !== id))
        }
        else {
            console.log("no images to delete")
        }
    }
    // upload button
    async function uploadimg(e) {
        const fileList = e.target.files;
        if (fileList.length > 0) {
            setFiles(files => [...files, ...Array.from(fileList)])
            // console.log("in upload", files)
        }
    }

    function readFileAsync(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                resolve({
                    name: file.name,
                    id: uuid(),
                    url: reader.result,
                    type: "image"
                });
            };

            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    const requestEdit = async (data) => {
        // console.log("Formdata: ", data)

        const storeImage = async (image) => {//(image) => { 
            return new Promise((resolve, reject) => {
                // const fbStorage = getStorage()
                const fileName = `${image.name}-${uuid()}`
                const storageRef = ref(storage, '/images/' + fileName)

                const uploadTask = uploadBytesResumable(storageRef, image)
                uploadTask.on(
                    'state_changed',
                    (snapshot) => { },
                    (error) => {
                        reject(error)
                    },
                    () => {
                        // Handle successful uploads on complete
                        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            resolve(downloadURL)
                        })
                    }
                )
            })
        }
        // console.log("Onsubmit: ", data)
        // console.log("Before filter existing:", images)
        let prev = images.filter((image) => (!image.type))
        // console.log("after filter existing:", prev)

        prev.forEach(function (prev) { delete prev.id });
        let kept = prev.map(function (key) { return key.url });
        console.log("Filtered existing:", kept)

        let imgUrls = []
        // console.log("uploaded images: ", data.images)
        if (data.images.length > 0) {
            imgUrls = await Promise
                .all(data.images.map((image) => storeImage(image))
                ).catch(() => { return })
        }

        var send = {
            ...data,
            ProductImages: [...kept, ...imgUrls],
            email: JSON.parse(localStorage.getItem("user_data")).email,
            jwtToken: tokenStorage.retrieveToken()
        }
        console.log(send)
        let stringified = JSON.stringify(send);
        // console.log(stringified)
        try {
            const response = await fetch(bp.buildPath('api/editproduct'),
                {
                    method: 'POST',
                    body: stringified,
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

        // window.location.href = '/Home/UserListings';
    };

    const onDelete = async (listingId) => {
        if (window.confirm('Are you sure you want to delete?')) {
            // api call
            let storage = require("../tokenStorage")
            let send = { ProductName: listingId, jwtToken: storage.retrieveToken() }
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
            //   const updatedListings = listings.filter(
            //     (listing) => listing.id !== listingId
            //   )
            //   setListings(updatedListings)
        }
    }

    function goBack() {

    }

    return (
        <Container className='formOverlay'>
            <Container
                className="justify-content-center d-flex align-items-center"
                style={{ "minHeight": "56vh" }}
            >
                <Row>
                    <h5>Edit Listing</h5>
                    <hr />
                    <Col>
                        <Form noValidate onSubmit={handleSubmit(requestEdit)} >
                            <Row className="mb-3">
                                <Form.Group>
                                    <Form.Label>Product Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="ProductName"
                                        {...register("ProductName")}
                                        isInvalid={!!errors.ProductName && touchedFields.ProductName}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.ProductName?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Product Category</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="ProductCategory"
                                        {...register("ProductCategory")}
                                        isInvalid={!!errors.ProductCategory && touchedFields.ProductCategory}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Product Condition</Form.Label>
                                    <Form.Control
                                        as="select"
                                        type="text"
                                        name="ProductCondition"
                                        {...register("ProductCondition")}
                                        isInvalid={!!errors.ProductCondition && touchedFields.ProductCondition}
                                    // defaultValue={value}
                                    >
                                        <option value="">Select condition...</option>
                                        <option value="New">New</option>
                                        <option value="Like New">Like New</option>
                                        <option value="Good">Good</option>
                                        <option value="Fair">Fair</option>
                                        <option value="Poor">Poor</option>

                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.ProductCondition?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        type="text"
                                        name="ProductDescription"
                                        {...register("ProductDescription")}
                                        isInvalid={!!errors.ProductDescription && touchedFields.ProductDescription}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.ProductDescription?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group  >
                                    <Form.Label>Price</Form.Label>
                                    <InputGroup className="mb-3">
                                        <InputGroup.Text>$</InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            name="ProductPrice"
                                            {...register("ProductPrice")}
                                            isInvalid={!!errors.ProductPrice && touchedFields.ProductPrice}
                                        />
                                        <InputGroup.Text>.00</InputGroup.Text>
                                    </InputGroup>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.ProductPrice?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group  >
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
                                <Form.Group  >
                                    <Form.Label>Phonenumber</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="contactInfo"
                                        {...register("contactInfo")}
                                        isInvalid={!!errors.contactInfo && touchedFields.contactInfo}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.contactInfo?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>City</Form.Label>
                                    <Form.Control
                                        className='mb-3'
                                        type="text"
                                        name="ProductCity"
                                        {...register("ProductCity")}
                                        isInvalid={!!errors.ProductCity && touchedFields.ProductCity}
                                    ></Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.ProductCity?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>State</Form.Label>
                                    <Form.Control
                                        className='mb-3'
                                        type="text"
                                        name="ProductState"
                                        {...register("ProductState")}
                                        isInvalid={!!errors.ProductState && touchedFields.ProductState}
                                    ></Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.ProductState?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label htmlFor="fileUpload" onChange={uploadimg} ref={fileInput}></Form.Label>
                                    {/* <Icon style={{ fontSize: '20px'}} type="camera" /> */}
                                    <Form.Control
                                        style={{ display: 'none' }}
                                        className="mb-3"
                                        id="fileUpload"
                                        type="file"
                                        name="images"
                                        accept="image/*"
                                        multiple
                                        {...register("images", { onChange: uploadimg })}
                                        isInvalid={!!errors.images && dirtyFields.images}
                                    />
                                    {/* </Form.Label> */}
                                    <Button onClick={handleClick}>Upload Images</Button>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.images?.message}
                                    </Form.Control.Feedback>
                                    <hr />
                                    <Row
                                        className="justify-content-start mb-3" xs="auto"
                                    >
                                        {images.map((media) => (
                                            <Col
                                                key={media.id}
                                                onMouseOver={() => setHover(true)}
                                                onMouseLeave={() => setHover(false)}
                                                style={{ position: 'relative', maxWidth: '150px', maxHeight: '150px' }}
                                            // xs
                                            >
                                                <Image
                                                    fluid
                                                    // thumbnail
                                                    src={media.url}
                                                    // alt="product"
                                                    key={media.id}
                                                    style={{ maxWidth: '100%', maxHeight: '100%' }}
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
                                    {/* </Container> */}
                                </Form.Group>
                            </Row>
                            {/* <Form.Group controlId="formControls" > */}
                            <ButtonGroup>
                                <Button
                                    variant="success"
                                    type="submit"
                                    disabled={formState.isSubmitting}
                                    className="justify-content-start btn btn-primary">
                                    {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1">
                                    </span>}
                                    Confirm
                                </Button>
                                <Button variant='warning' onClick={() => resetForm()}>Reset</Button>
                                <Button variant='danger' onClick={() => onDelete()}>Delete</Button>
                                <Button variant="secondary" onClick={() => goBack()}>Return</Button>
                            </ButtonGroup>

                        </Form>
                    </Col>
                </Row>
            </Container>
        </Container>
    )
}

export default withRouter(EditListing)
