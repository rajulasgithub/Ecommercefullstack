import React from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './Style.css'

const Order = () => {
  return (
    <div>
      <div>
      <Container>
      <Row>
       

<Col>
<Card  className=''>
  <div>
<Card.Img variant="top" src='' className=''/>
</div>
<div>
<Card.Body className=''>
<Card.Title className=''>{}</Card.Title>
<Card.Text className=''>Prize:{}</Card.Text>
<Card.Text className=''>Size:{}</Card.Text>
<Card.Text >Material:</Card.Text>

  </Card.Body>
  </div>
 </Card>
</Col>   
</Row>
</Container>
        
      </div>
    </div>
  )
}

export default Order