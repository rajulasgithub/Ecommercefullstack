import React from 'react'
import './Style.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


const OrderSummary = () => {
  return (
    <div className='odrsmryback'>
        <div>
        <Container>
      <Row>
        <Col>
        <div className='odrmaindiv'>
          <div>
      <h3>Orer Total</h3>
      <h3>...</h3>
      </div>

        </div>
        </Col>
      </Row>
      </Container>

        </div>
    </div>
  )
}

export default OrderSummary