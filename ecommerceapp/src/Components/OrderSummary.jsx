import React from 'react'
import './Style.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';



const OrderSummary = () => {
  return (
    <div className='odrsmryback'>
        <div>
        <Container>
      <Row className='pt-5'>
      <Col>
      <div className='ordercolone'>
        <div className='odraddrsflex pt-4 ps-4 pe-4'>
        <h5>deliver to:name</h5>
        <Button variant="outline-primary">Change</Button>{' '}
        </div>
        <div className='  ps-4 pe-4'>
       <h5>Address:</h5><p className=''>.....</p>
       </div>
       <h6 className='ps-4 pb-5'>Phone:</h6>
      </div>
      </Col>
      <Col>
      <div className='ordercoltwo'>
       <div className='odraddrsflex pt-5 ps-5 pe-5'>
       <h6>Price(no of item)</h6><h6>....</h6>
       </div>
       <div className='odraddrsflex pt-3 ps-5 pe-5'>
       <h6>Delivery Charges:</h6>
       <h6>....</h6>
       </div>
       <div className='odraddrsflex pt-3 ps-5 pe-5 pb-3'>
       <h6>Total:</h6>
       <h6>....</h6>
       </div>
       <div className='text-center pb-4'>
       <Button variant="warning">Conform Order</Button>{' '}
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