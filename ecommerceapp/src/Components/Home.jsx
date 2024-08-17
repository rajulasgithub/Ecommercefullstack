import React from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Style.css'

const Home = () => {
  return (
    <div>
        <div >
        <Container>
      <Row >
        <Col className='homecolone'>1 of 2</Col>
        <Col>2 of 2</Col>   
      </Row>
      <Row >
        <Col className='homecoltwo'>1 of 2</Col>
        <Col>2 of 2</Col>   
      </Row>
      </Container>

        </div>

    </div>
  )
}

export default Home