import React from 'react'
import '../App.css';
import { Link } from 'react-router-dom'
import { Card, Container, Col, Row, Button, ButtonGroup, InputGroup, ListGroup } from 'react-bootstrap'

function ListingItem({ listing, id, onEdit, onDelete }) {
  return (
    <Col md="auto mb-3">
      <Card style={{ width: '18rem' }}>
        <Card.Header></Card.Header>
        <Container fluid>


          <Card.Title><strong>{listing.ProductName}</strong></Card.Title>
          {/* <Card.Body>
            <Card.Text>
              Description
            </Card.Text>
          </Card.Body> */}
        </Container>
        <ListGroup variant='flush'>
          <ListGroup.Item><strong>Category: </strong>{listing.ProductCategory}</ListGroup.Item>
          {/* <ListGroup.Item><strong>Date: </strong>{listing.ProductDescription}</ListGroup.Item> */}
          <ListGroup.Item><strong>Price: </strong>${listing.ProductPrice}</ListGroup.Item>
          {/* <ListGroup.Item><strong>Price: </strong>${listing.ProductPrice}</ListGroup.Item> */}
        </ListGroup>
        <Container>
        {/* <Card.Img variant="top" 
        src={listing.ProductImages[0]} 
        style={{objectFit: "cover" }}
        /> */}
        </Container>
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