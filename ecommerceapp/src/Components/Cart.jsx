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
// useEffect(() => {
//   axios.get('http://localhost:8080/product/viewcart').then((response)=>{
//     console.log(response);  
//     setCartitem(response.data.data)
//   }).catch((error)=>{
//     console.log(error); 
//   })
// }, [])

// console.log(cartitem);

  return (
    <div>
     <div>

     <Container>
      <Row>
    

<Col>
{/* {cartitem.map((item)=>( */}
   
   <Card  className=' '>
<Card.Img variant="top" src='' className=''/>
<Card.Body className=''>
<Card.Title className=''></Card.Title>
<Card.Text className=''></Card.Text>
<Card.Text className=''></Card.Text>
<Card.Text >Material:</Card.Text>




<div className='text-center'>
<Button variant="primary" size="sm" >Add to cart</Button>
</div>
</Card.Body>
</Card>


{/* ))} */}
</Col>


        
       
      </Row>
      </Container>


     </div>
    </div>
  )
}

export default Cart