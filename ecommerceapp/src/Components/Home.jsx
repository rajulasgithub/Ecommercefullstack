import React from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import './Style.css'
import Card from 'react-bootstrap/Card';
import Header from './Header';


const Home = () => {
  return (
    <>
    <Header/>
    <div className='homepage pt-5'>

      <div className='hmtextdiv' >
        <h1 className='mt-3'>
        Discover Your Perfect Dress for Every Occasion

        </h1>
        <h5 style={{fontFamily:"cursive",textShadow:"none"}} className='mt-4'>
        "From elegant evening gowns to breezy casual styles, explore our collection of dresses designed to celebrate you."
        </h5>
       <Button  variant="dark" className='me-2 mt-4' >
        Shop Now
       </Button>
       <Button variant="dark" className=' mt-4'>
        Explore New Arrivals
       </Button>
      </div>
      <div className="hnfindstyle">
        <h5 style={{textAlign:"center",color:"white"}}>Find Your Style</h5>
        <div>
          <Container>
          <Row>
            <Col md="auto">
         
         <Card style={{ width: '10rem',height:"16rem",backgroundColor:"rgba(255,255,255,0.3)" }}>
      <Card.Img variant="top"  smd="auto" src="/images/ethnic.jpg" style={{height:"200px"}} />
      <Card.Body>
        <Card.Title>Ethnic wears</Card.Title>
        {/* <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <Button variant="primary">Go somewhere</Button> */}
      </Card.Body>
    </Card>
    </Col>

        <Col md="auto"> 
    <Card style={{ width: '10rem',height:"16rem",backgroundColor:"rgba(255,255,255,0.3)" }}>
      <Card.Img variant="top"  smd="auto" src="/images/partywear.jpg" style={{height:"200px"}} />
      <Card.Body>
        <Card.Title>Party Wears</Card.Title>
        {/* <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <Button variant="primary">Go somewhere</Button> */}
      </Card.Body>
    </Card>
    </Col>
    
    <Col md="auto"> 
    <Card style={{ width: '10rem',height:"16rem",backgroundColor:"rgba(255,255,255,0.3)" }}>
      <Card.Img variant="top"  smd="auto" src="/images/casualwears.jpg" style={{height:"200px"}} />
      <Card.Body>
        <Card.Title>Casual Wears</Card.Title>
        {/* <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <Button variant="primary">Go somewhere</Button> */}
      </Card.Body>
    </Card>
    </Col>

     <Col md="auto"> 
    <Card style={{ width: '10rem',height:"16rem",backgroundColor:"rgba(255,255,255,0.3)" }}>
      <Card.Img variant="top"  smd="auto" src="/images/gowns.jpg" style={{height:"200px"}} />
      <Card.Body>
        <Card.Title>Gowns</Card.Title>
        {/* <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <Button variant="primary">Go somewhere</Button> */}
      </Card.Body>
    </Card>
    </Col>    

    <Col md="auto"> 
    <Card style={{ width: '10rem',height:"16rem",backgroundColor:"rgba(255,255,255,0.3)" }}>
      <Card.Img variant="top"  smd="auto" src="/images/kidswear.jpg" style={{height:"200px"}} />
      <Card.Body>
        <Card.Title>kids Wear</Card.Title>
        {/* <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <Button variant="primary">Go somewhere</Button> */}
      </Card.Body>
    </Card>
    </Col>    

    <Col md="auto"> 
    <Card style={{ width: '10rem',height:"16rem",backgroundColor:"rgba(255,255,255,0.3)" }}>
      <Card.Img variant="top"  smd="auto" src="/images/menswear.jpg" style={{height:"200px"}} />
      <Card.Body>
        <Card.Title>Mens Wear</Card.Title>
        {/* <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <Button variant="primary">Go somewhere</Button> */}
      </Card.Body>
    </Card>
    </Col>    

    <Col md="auto"> 
    <Card style={{ width: '10rem',height:"16rem",backgroundColor:"rgba(255,255,255,0.3)" }}>
      <Card.Img variant="top"  smd="auto" src="/images/ethnic.jpg" style={{height:"200px"}} />
      <Card.Body>
        <Card.Title>Ethnic wears</Card.Title>
        {/* <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <Button variant="primary">Go somewhere</Button> */}
      </Card.Body>
    </Card>
    </Col>    

         </Row>
         </Container>
        </div>
      </div>
        {/* <div className='text-center  homepagehead'>
      <h1 className=' hometxt'>Stay Home.Shop Online..
       <br/> With trendLife Collections
      </h1>
     <h4 className='text-white'>Huge Collection of Women men and kids wear</h4>
        </div> */}
        {/* <Container>
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
      </Container> */}
    </div>
    </>
  )
}

export default Home