import React from 'react'
import { Link } from 'react-router-dom'
import { Card, Container, Col, Row, Button, ButtonGroup, InputGroup, ListGroup } from 'react-bootstrap'

function ListingItem( {listing, id, onEdit, onDelete}) {
  return (
    <Col md="auto mb-3">
      <Card style={{ width: '18rem' }}>
        <Card.Header></Card.Header>
        <Container fluid>


          <Card.Title><strong>{listing.ProductName}</strong></Card.Title>
          <Card.Body>
            <Card.Text>
              {/* Description */}
            </Card.Text>
          </Card.Body>
        </Container>
        <ListGroup variant='flush'>
          <ListGroup.Item><strong>Category: </strong>{listing.ProductCategory}</ListGroup.Item>
          <ListGroup.Item><strong>Date: </strong>{listing.DateListed}</ListGroup.Item>
          <ListGroup.Item><strong>Price: </strong>${listing.ProductPrice}</ListGroup.Item>
          <ListGroup.Item><strong>Price: </strong>${listing.ProductPrice}</ListGroup.Item>
        </ListGroup>
        <Card.Img variant="top" src="holder.js/100px180" />
        <Card.Footer>
          <Row className="justify-content-md-center"  >
            {
              onEdit &&
              <Button
                to={{
                  pathname: `/EditListing/${listing._id}`,
                  state: {
                    listing:listing,
                  }
                }}
                // onClick={() => onEdit(id)}
                className="Link Col"
                as={Link}
                variant="success"
                xs={6}>
                Edit
              </Button>
            }
            {
              onDelete &&
              <Button as={Col}
                onClick={() => onDelete(id)}
                variant="danger"
                xs={6}>
                Delete
              </Button>
            }
          </Row>
        </Card.Footer>
      </Card>
    </Col>
  )
}

export default ListingItem