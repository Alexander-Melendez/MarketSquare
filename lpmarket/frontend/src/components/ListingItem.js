import React from 'react'
import '../App.css';
import { Link } from 'react-router-dom'
import { Card, Container, Col, Row, Button, ButtonGroup, Carousel, ListGroup, CarouselItem } from 'react-bootstrap'


function ListingItem({ listing, id, onEdit, onDelete }) {
  return (
    <Col md="auto mb-3">
      <Card style={{ width: '18rem' }}>
        <Card.Header></Card.Header>
        <Container fluid>


          <Card.Title><strong>{listing.ProductName}</strong></Card.Title>

        </Container>
        <ListGroup variant='flush'>
          <ListGroup.Item><strong>Category: </strong>{listing.ProductCategory}</ListGroup.Item>
          {/* <ListGroup.Item><strong>Date: </strong>{listing.ProductDescription}</ListGroup.Item> */}
          <ListGroup.Item><strong>Price: </strong>${listing.ProductPrice}</ListGroup.Item>
          {/* <ListGroup.Item><strong>Price: </strong>${listing.ProductPrice}</ListGroup.Item> */}
        </ListGroup>
        {/* <Container
                        style={{
                          // position: 'relative',
                          width: '150px',
                          height: '150px'
                      }}>
          <Carousel>
            {
              listing.ProductImages &&
              listing.ProductImages.map((image) =>
              (<Carousel.Item
              >
                <img
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: "cover"
                  }}
                  key={listing._id}
                  className="d-block w-100"
                  src={image}
                  alt=""
                />
              </Carousel.Item>)
              )}
          </Carousel>
        </Container> */}
        <Card.Footer>

          <Row className="justify-content-md-center"  >
            <ButtonGroup>
              {
                onEdit &&
                <Button
                  to={{
                    pathname: `/EditListing/${listing._id}`,
                    state: {
                      listing: listing,
                    }
                  }}
                  // onClick={() => onEdit(id)}
                  className="Link"
                  as={Link}
                  variant="success">
                  Edit
                </Button>
              }
              {
                onDelete &&
                <Button
                  onClick={() => onDelete(id)}
                  variant="danger"
                >
                  Delete
                </Button>
              }
            </ButtonGroup>
          </Row>
        </Card.Footer>
      </Card>
    </Col>
  )
}

export default ListingItem