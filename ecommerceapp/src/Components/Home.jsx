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
        <h5 style={{textAlign:"center",color:"white",textShadow:"2px 2px black"}}>Find Your Style</h5>
        <div>
          <Container style={{display:'flex',justifyContent:"center",marginTop:"2rem"}}>
          <Row>
            <Col md="auto">
         
    
         <Card  style={{ width: '10rem',height:"16rem",backgroundColor:"rgba(255,255,255,0.3)",boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
      <Card.Img variant="top"  smd="auto" src="/images/ethnic.jpg"  style={{height:"200px"}} />
      <Card.Body>
        <Card.Title className='text-center text-white'>Ethnic wears</Card.Title>
        {/* <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <Button variant="primary">Go somewhere</Button> */}
      </Card.Body>
    </Card>
    </Col>

        <Col md="auto"> 
    <Card style={{ width: '10rem',height:"16rem",backgroundColor:"rgba(255,255,255,0.3)",boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
      <Card.Img variant="top"  smd="auto" src="/images/partywear.jpg" style={{height:"200px"}} />
      <Card.Body>
        <Card.Title className='text-center text-white'>Party Wears</Card.Title>
        {/* <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <Button variant="primary">Go somewhere</Button> */}
      </Card.Body>
    </Card>
    </Col>
    
    <Col md="auto"> 
    <Card style={{ width: '10rem',height:"16rem",backgroundColor:"rgba(255,255,255,0.3)",boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
      <Card.Img variant="top"  smd="auto" src="/images/casualwears.jpg" style={{height:"200px"}} />
      <Card.Body>
        <Card.Title className='text-center text-white'>Casual Wears</Card.Title>
        {/* <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <Button variant="primary">Go somewhere</Button> */}
      </Card.Body>
    </Card>
    </Col>

     <Col md="auto"> 
    <Card style={{ width: '10rem',height:"16rem",backgroundColor:"rgba(255,255,255,0.3)",boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
      <Card.Img variant="top"  smd="auto" src="/images/gowns.jpg" style={{height:"200px"}} />
      <Card.Body>
        <Card.Title className='text-center text-white'>Gowns</Card.Title>
        {/* <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <Button variant="primary">Go somewhere</Button> */}
      </Card.Body>
    </Card>
    </Col>    

    <Col md="auto"> 
    <Card style={{ width: '10rem',height:"16rem",backgroundColor:"rgba(255,255,255,0.3)" ,boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}>
      <Card.Img variant="top"  smd="auto" src="/images/kidswear.jpg" style={{height:"200px"}} />
      <Card.Body>
        <Card.Title className='text-center text-white'>kids Wear</Card.Title>
        {/* <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <Button variant="primary">Go somewhere</Button> */}
      </Card.Body>
    </Card>
    </Col>    

    <Col md="auto"> 
    <Card style={{ width: '10rem',height:"16rem",backgroundColor:"rgba(255,255,255,0.3)",boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
      <Card.Img variant="top"  smd="auto" src="/images/menswear.jpg" style={{height:"200px"}} />
      <Card.Body>
        <Card.Title className='text-center text-white'>Mens Wear</Card.Title>
        {/* <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <Button variant="primary">Go somewhere</Button> */}
      </Card.Body>
    </Card>
    </Col>    

    <Col md="auto"> 
    <Card style={{ width: '10rem',height:"16rem",backgroundColor:"rgba(255,255,255,0.3)",boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
      <Card.Img variant="top"  smd="auto" src="/images/ethnic.jpg" style={{height:"200px"}} />
      <Card.Body>
        <Card.Title className='text-center text-white'>Ethnic wears</Card.Title>
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
      <Container style={{display:"flex",justifyContent:"space-around",marginTop:"4rem",marginBottom:"",backgroundColor:"rgba(0,0,0,0.4)"}}>

     
      <Row >
          <Col className='mt-3 '>
     
        
          <div style={{display:"flex"}}>
        <div >
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-truck text-primary me-2 " viewBox="0 0 16 16">
        <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5zm1.294 7.456A2 2 0 0 1 4.732 11h5.536a2 2 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456M12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/>
        </svg>
        </div>
        <div>
          <h6 className='text-white'>Free Shipping</h6>
          <p className='text-white'>For All Orders Above 999</p>
        </div>
        </div>
    
          </Col>

          <Col className='mt-3'>
     
        
     <div style={{display:"flex"}}>
   <div >
   <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-credit-card-2-front-fill text-primary me-2" viewBox="0 0 16 16">
  <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2.5 1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm0 3a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1z"/>
</svg>
   </div>
   <div>
     <h6 className='text-white'>Secure Payment</h6>
     <p className='text-white'> Provide Secure Payment</p>
   </div>
   </div>

     </Col>
     <Col className='mt-3'>
     
        
     <div style={{display:"flex"}}>
   <div >
   <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-coin text-primary me-2" viewBox="0 0 16 16 ">
  <path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518z"/>
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
  <path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11m0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12"/>
</svg>
   </div>
   <div>
     <h6 className='text-white'>100% Money Back</h6>
     <p className='text-white'>30 Days Return Policy</p>
   </div>
   </div>

     </Col>

     <Col className='mt-3'>
     
        
     <div style={{display:"flex"}}>
   <div >
   <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-chat-quote text-primary me-2" viewBox="0 0 16 16">
  <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105"/>
  <path d="M7.066 6.76A1.665 1.665 0 0 0 4 7.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 0 0 .6.58c1.486-1.54 1.293-3.214.682-4.112zm4 0A1.665 1.665 0 0 0 8 7.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 0 0 .6.58c1.486-1.54 1.293-3.214.682-4.112z"/>
</svg>
   </div>
   <div>
     <h6 className='text-white'>Online Support</h6>
     <p className='text-white'>24*7 Dedicated Support</p>
   </div>
   </div>

     </Col>
        </Row>
        </Container >
        <div style={{backgroundColor:"rgba(40,90,120)",height:"300px",fontFamily:"cursive"}}>

          <Container style={{display:"flex",justifyContent:"space-around"}}>
            <Row>
              <Col md="auto">
              <Card style={{ width: '18rem',height:"230px",marginTop:"50px",backgroundColor:"rgba(255,255,255)",boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
      <Card.Body>
        <Card.Title className='text-center text-dark'>Quality and Style You Can Trust</Card.Title>
        <Card.Text style={{textAlign:"justify"}}>
        Our passion is crafting dresses that make you look and feel your best. With high-quality fabrics and timeless designs, our collection is tailored to flatter every shape and suit any style.
        </Card.Text>
        {/* <Button variant="primary">Go somewhere</Button> */}
      </Card.Body>
    </Card>
              </Col>
              <Col md="auto">
              <Card style={{ width: '18rem',height:"230px",marginTop:"50px",backgroundColor:"rgba(255,255,255)",boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
      <Card.Body>
        <Card.Title className='text-center text-dark'>Ethnic wearsMust-Haves This Season</Card.Title>
        <Card.Text style={{textAlign:"justify"}}>
        Shop our bestsellers, customer favorites, and timeless styles that are flying off the shelves.
        </Card.Text>
        {/* <Button variant="primary">Go somewhere</Button> */}
      </Card.Body>
    </Card>
              </Col>
              <Col md="auto">
              <Card style={{ width: '18rem',height:"230px",marginTop:"50px",backgroundColor:"rgba(255,255,255)",boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
      <Card.Body>
        <Card.Title className='text-center text-dark'>What Our Customers Are Saying</Card.Title>
        <Card.Text style={{textAlign:"justify"}}>
        I felt amazing in my dress! The fit and quality are unbeatable.
        Perfect dress for every occasion—I keep coming back
                </Card.Text>
        {/* <Button variant="primary">Go somewhere</Button> */}
      </Card.Body>
    </Card>
              </Col>
              {/* <Col md="auto">
              <Card style={{ width: '18rem',height:"",marginTop:"50px",backgroundColor:"rgba(255,255,255)",boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
      <Card.Body>
        <Card.Title className='text-center text-dark'>Ethnic wears</Card.Title>
        <Card.Text className=''>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
      </Card.Body>
    </Card>
              </Col> */}
            </Row>
          </Container>
bm
        </div>
        <div style={{height:"200px",backgroundColor:"black"}}>
vbj
        </div>
        {/* <div className='text-center  homepagehead'>
      <h1 className=' hometxt'>Stay SomeHome.Shop Online..
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