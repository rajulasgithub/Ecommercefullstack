import React, { useEffect, useState } from 'react'
import './Style.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import axios from 'axios'
import Form from 'react-bootstrap/Form';


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
        <div className='carttitlebartop'>
          <div className='carttitlebar'>
           <h6>Product</h6>
          </div>
          <div className='carttitlebar'>
          <h6 className=''>Prize</h6>
          
          <h6 className=''>Quantity</h6>
          <h6 className=''>Total Prize</h6>
        </div>
        </div>
      {cartitem.map((item)=>(

            <Card style={{ maxwidth: '50rem',height:'10rem' }} className='mt-5 cartcardstyle'>
         
            <div className='cardflex'>
            <div>
            <Card.Img variant="top" src={item.prdId.image[0]} style={{width:'7rem',height:'10rem'}} className="img-rounded"/>
            </div>
            
            <Card.Body>
              <div className='cardhead'>
            <Card.Title style={{fontFamily:'monospace'}}>{item.prdId.prdName}</Card.Title>
            <Card.Text style={{fontFamily:'monospace'}}>Size:{item.prdId.size}</Card.Text>
            </div>
            
            <div className='cardflexone'>
            <div>
            <Card.Text style={{fontFamily:'monospace'}}>{item.prdId.prize}</Card.Text>
            </div>
            <div className='counterflex'>
              {/* <div className='counterflex'> */}
              <button className='decrement'>-</button>
            <Card.Text style={{fontFamily:'monospace'}}>{item.quantity}</Card.Text>
            <button>+</button>
            {/* </div> */}
            </div>
            <div>
            <Card.Text style={{fontFamily:'monospace'}}>{item.prdId.prize}</Card.Text>
            </div>
            </div>
           
            <div>
            <Button variant="success" size="sm" className='cartbtnstyle me-2'>Buy Now</Button>
            <Button variant="success"  size="sm" className='cartbtnstyle'>Remove</Button>


            </div>
           
           </Card.Body>
           
           </div>
        
        </Card>
          ))}
      </Col>

        
        <Col sm={3} className='cartcolstyle'>
        <h5 className='text-center mt-3'>Shipping Address</h5>
        <Form.Control
          as="textarea" className='carttxtare mt-3 '
          placeholder="Enter Address"
          style={{ height: '30px',backgroundColor:"#E6E6FA",borderRadius:25 }}
        />
        <div className='formflex gap-3'>
        <Form.Control
          type='input' className='mt-3'
          placeholder="State"
          style={{ height: '30px',backgroundColor:"#E6E6FA",borderRadius:25 }}
        />
        <Form.Control
          type='input' className='mt-3'
          placeholder="District"
          style={{ height: '30px',backgroundColor:"#E6E6FA",borderRadius:25 }}
        />
        
           </div> 
           <div className='formflex gap-2'>
           <Form.Control
          type='input' className='mt-3'
          placeholder="District"
          style={{ height: '30px',backgroundColor:"#E6E6FA",borderRadius:25 }}
        />
         <Form.Control
          type='input' className='mt-3'
          placeholder="District"
          style={{ height: '30px',backgroundColor:"#E6E6FA",borderRadius:25 }}
        />
        </div>
       <div className='text-center d-grid mt-3'>
       <Button variant="dark" size="lg" >Update</Button>

       </div>
       <hr className='mt-4'></hr>
       <div className='carttotalstyle'>
        <div className='carttotalinner'>
        <div>
        <h4>Cart total</h4>
        </div>
       <div>
        <div className='carttotaldivflex'>
        <>
        <h6>Cart Subtotal</h6>
        </>
        <>
        <h6>...</h6>
        </>
        </div>
        <div className='carttotaldivflex'>
        <>
        <h6>Discount</h6>
        </>
        <>
        <h6>...</h6>
        </>
        </div>
        <div className='carttotaldivflex'>
        <>
        <h6>Cart total</h6>
        </>
        <>
        <h6>...</h6>
        </>
        </div>

       </div>
       </div>
       </div>
        </Col> 
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