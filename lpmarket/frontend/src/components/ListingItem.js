import React from 'react'

import { Card, Container, Col, Row, Button, ButtonGroup, InputGroup, ListGroup } from 'react-bootstrap'

function ListingItem({ listing, id, onEdit, onDelete }) {
  return (
    <Col md="auto">
      <Card style={{ width: '18rem' }}>
        <Card.Header></Card.Header>
        <Container fluid>

          <Card.Img variant="top" src="holder.js/100px180" />
          <Card.Title>Card Title</Card.Title>
          <Card.Body>

            <Card.Text>
              Description
            </Card.Text>
          </Card.Body>


        </Container>
        <ListGroup variant='flush'>
          <ListGroup.Item>Category</ListGroup.Item>
          <ListGroup.Item>Date</ListGroup.Item>
          <ListGroup.Item>Price</ListGroup.Item>
        </ListGroup>
        <Card.Footer className="justify-content-md-center" >
          <Container as={Row} xs={6} >
            {
              onEdit &&
              <Button
                onClick={() => onEdit(id)}
                as={Col}
                variant="outline-success">
                Edit
              </Button>
            }
            {
              onDelete &&
              <Button as={Col}
                onClick={() => onDelete(id)}
                variant="outline-danger">
                Delete
              </Button>
            }
          </Container>
        </Card.Footer>
      </Card>
    </Col>
  )
}

export default ListingItem