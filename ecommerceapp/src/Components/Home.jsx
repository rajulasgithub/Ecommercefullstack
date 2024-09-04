import React from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Style.css'
import Card from 'react-bootstrap/Card';
import Header from './Header';


const Home = () => {
  return (
    <>
    <Header/>
    <div className='homepage'>
        <div className='text-center  homepagehead'>
      <h1 className=' hometxt'>Stay Home.Shop Online..
       <br/> With trendLife Collections
      </h1>
     <h4 className='text-white'>Huge Collection of Women men and kids wear</h4>
        </div>
        <Container>
      <Row>
        <Col>
        <Card  className='homecardflex'>
      <Card.Img variant="top" src='/images/cardcolone.jpg' />
      <Card.Body>
        <Card.Title>Card Title</Card.Title>
        
      </Card.Body>
    </Card>
    </Col>
    <Col>
    <Card >
      <Card.Img variant="top" src="holder.js/100px180" />
      <Card.Body>
        <Card.Title>Card Title</Card.Title>
        
      </Card.Body>
    </Card>
    </Col>
    <Col>
    <Card >
      <Card.Img variant="top" src="holder.js/100px180" />
      <Card.Body>
        <Card.Title>Card Title</Card.Title>
        
      </Card.Body>
    </Card> 
    </Col>
    <Col><Card >
      <Card.Img variant="top" src="holder.js/100px180" />
      <Card.Body>
        <Card.Title>Card Title</Card.Title>
        
      </Card.Body>
    </Card>
        </Col>
        
        
      </Row>
      </Container>
    </div>
    </>
  )
}

export default Home