import React, { useEffect, useState } from 'react'
import './Style.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import axios from 'axios'

const Cart = () => {

   
    const[cartitem,setCartitem]=useState([]);
    
useEffect(() => {
    const token= localStorage.getItem('token')

    const headers={
      
      'Authorization':`bearer ${token}`,
      // 'Content-Type':'application/json'
    }
  axios.get('http://localhost:8080/product/viewcart',{
    headers:headers
  }).then((response)=>{
    console.log(response);  
    setCartitem(response.data.data);
  }).catch((error)=>{
    console.log(error); 
  })
}, [])

console.log(cartitem);

  return (
    <div>
     <div >
      
     <div className='cartinnerdiv '>
      <div className='carthead'>
      <h4 style={{fontFamily:'monospace'}} className=''>Shopping Bag</h4>
      <h6 style={{fontFamily:'monospace'}} className=''>6 items in your bag</h6>
      </div>
      <Container>
      <Row >
         
        <Col sm={8} className='cartcolstyleone me-5' >
      {cartitem.map((item)=>(

            <Card style={{ width: '50rem',height:'10rem' }} className='mt-5 cartcardstyle'>
         
            <div className='cardflex'>
            <div>
            <Card.Img variant="top" src={item.prdId.image[0]} style={{width:'6rem',height:'10rem'}} />
            </div>
            
            <Card.Body>
              <div>
            <Card.Title>{item.prdId.prdName}</Card.Title>
            <Card.Text>Size:{item.prdId.size}</Card.Text>
            </div>
            
           
            <div className='cardflexone'>
            <div>
            <Card.Text>prize:{item.prdId.prize}</Card.Text>
            </div>
            <div>
            <Card.Text>Quantity:{item.quantity}</Card.Text>
            </div>
            <div>
            <Card.Text>totalprize:{item.prdId.prize}</Card.Text>
            </div>
            </div>
           
            {/* <Button variant="primary">Go somewhere</Button> */}
           </Card.Body>
           
           </div>
        
        </Card>
          ))}
      </Col>

        
        <Col sm={3} className='cartcolstyle'  ></Col>
    
       
      </Row>
      </Container>

      


     </div>
      
     {/* <Container>
      <Row>
    

<Col>
{cartitem.map((item)=>(
   
   <Card  className=' '>
<Card.Img variant="top" src={item.prdId.image[0]} className='cartimg'/>
<Card.Body className=''>
<Card.Title className=''>{item.prdId.prdName}</Card.Title>
<Card.Text className=''>{item.prdId.material}</Card.Text>
<Card.Text className=''>{item.prdId.size}</Card.Text>
<Card.Text >{item.prdId.prize}</Card.Text>
<Card.Text >{item.quantity}</Card.Text>





<div className='text-center'>
<Button variant="primary" size="sm" >Buy Now</Button>
<Button variant="primary" size="sm" >Remove from Cart</Button>

</div>
</Card.Body>
</Card>


 ))} 
</Col>


        
       
      </Row>
      </Container> */}


     </div>
    </div>
  )
}

export default Cart