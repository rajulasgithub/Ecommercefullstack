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
    <div>
    <div className='homepage pt-5'>
      <div className='hmdiv'>
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
        <div style={{backgroundColor:"#008B8B",height:"300px",fontFamily:"cursive"}}>

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

        </div>
        <div style={{height:"200px",backgroundColor:"black",textAlign:"center",color:"white",fontFamily:"monospace"}}>

       <h6 className='pt-4'>About</h6>
       <h6>Our Service</h6>
       <h6>Contact Us</h6>
       <h6>Customer Care</h6>
       <div style={{display:"flex",justifyContent:"center"}}>
<div>
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-whatsapp me-2" viewBox="0 0 16 16">
  <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
</svg>
</div>
<div>
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-facebook me-2" viewBox="0 0 16 16">
  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
</svg>
</div>
<div>
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-instagram me-2" viewBox="0 0 16 16">
  <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
</svg>
</div>
       </div>
      
        </div>
       
      </div>
      <div className='hmres'>
     <div className='hmtextdiv' >
        <h3 className="mt-3">
        Discover Your Perfect Dress for Every Occasion

        </h3>
        <h6 style={{fontFamily:"cursive",textShadow:"none"}} className='mt-3'>
        "From elegant evening gowns to breezy casual styles, explore our collection of dresses designed to celebrate you."
        </h6>
       <Button  variant="dark" className='me-2 mt-3' >
        Shop Now
       </Button>
       <Button variant="dark" className=' mt-2'>
        Explore New Arrivals
       </Button>
      </div> 
      <Container>
        <Row className='mt-3'>
          <Col>
          <Card  style={{ width: '',height:"",backgroundColor:"rgba(255,255,255,0.3)",boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
      <Card.Img variant="top"  smd="auto" src="/images/ethnic.jpg"  style={{height:"150px"}} />
      <Card.Body>
        <Card.Title className='text-center text-white'>Ethnic wears</Card.Title>

      </Card.Body>
    </Card>
          </Col>
          <Col>
          <Card style={{ width: '',height:"",backgroundColor:"rgba(255,255,255,0.3)",boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
      <Card.Img variant="top"  smd="auto" src="/images/partywear.jpg" style={{height:"150px"}} />
      <Card.Body>
        <Card.Title className='text-center text-white'>Party Wears</Card.Title>
        
      </Card.Body>
    </Card>
          </Col>
          <Col>
          <Card style={{ width: '',height:"",backgroundColor:"rgba(255,255,255,0.3)",boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
      <Card.Img variant="top"  smd="auto" src="/images/casualwears.jpg" style={{height:"150px"}} />
      <Card.Body>
        <Card.Title className='text-center text-white'>Casual Wears</Card.Title>
        
      </Card.Body>
    </Card>
          </Col>
        </Row>
        <Row className='mt-4'>
          <Col>
          <Card style={{ width: '',height:"",backgroundColor:"rgba(255,255,255,0.3)",boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
      <Card.Img variant="top"  smd="auto" src="/images/gowns.jpg" style={{height:"150px"}} />
      <Card.Body>
        <Card.Title className='text-center text-white'>Gowns</Card.Title>
        
      </Card.Body>
    </Card>
          </Col>
          <Col >
          <Card style={{ width: '',height:"",backgroundColor:"rgba(255,255,255,0.3)" ,boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}>
      <Card.Img variant="top"  smd="auto" src="/images/kidswear.jpg" style={{height:"150px"}} />
      <Card.Body>
        <h6 className='text-center text-white'>kids Wear</h6>
        
      </Card.Body>
    </Card>
          </Col>
          <Col>
          <Card style={{ width: '',height:"",backgroundColor:"rgba(255,255,255,0.3)",boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
      <Card.Img variant="top"  smd="auto" src="/images/menswear.jpg" style={{height:"150px"}} />
      <Card.Body>
        <Card.Title className='text-center text-white'>MensWear</Card.Title>
       
      </Card.Body>
    </Card>
          </Col>
        </Row>
      </Container>
      <Container style={{backgroundColor:"rgba(0,0,0,0.4)",marginTop:"25px"}}>
        <Row className='pt-3'>
          <Col >
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
          <Col>
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
          
          
        </Row>
        <Row>
        <Col>
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
          <Col>
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
      </Container>
      <div style={{backgroundColor:"#008B8B",height:"520px",fontFamily:"cursive"}}>

          <Container style={{display:"flex",justifyContent:"space-around"}}>
            <Row>
              <Col md="auto">
              <Card style={{ width: '',height:"",marginTop:"30px",backgroundColor:"rgba(255,255,255)",boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
      <Card.Body>
        <Card.Title className='text-center text-dark'>Quality and Style You Can Trust</Card.Title>
        <Card.Text style={{textAlign:"justify"}}>
        Our passion is crafting dresses that make you look and feel your best. With high-quality fabrics and timeless designs, our collection is tailored to flatter every shape and suit any style.
        </Card.Text>
      </Card.Body>
    </Card>
              </Col>
              <Col md="auto">
              <Card style={{ width: '',height:"",marginTop:"20px",backgroundColor:"rgba(255,255,255)",boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
      <Card.Body>
        <Card.Title className='text-center text-dark'>Ethnic wearsMust-Haves This Season</Card.Title>
        <Card.Text style={{textAlign:"justify"}}>
        Shop our bestsellers, customer favorites, and timeless styles that are flying off the shelves.
        </Card.Text>
      </Card.Body>
    </Card>
              </Col>
              <Col md="auto">
              <Card style={{ width: '',height:"",marginTop:"20px",backgroundColor:"rgba(255,255,255)",boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)" }}>
      <Card.Body>
        <Card.Title className='text-center text-dark'>What Our Customers Are Saying</Card.Title>
        <Card.Text style={{textAlign:"justify"}}>
        I felt amazing in my dress! The fit and quality are unbeatable.
        Perfect dress for every occasion—I keep coming back
                </Card.Text>
      </Card.Body>
    </Card>
              </Col>
             
            </Row>
          </Container>
bm
        </div>

     
    </div>

    </div>
       </div>
    </>
  )
}

export default Home