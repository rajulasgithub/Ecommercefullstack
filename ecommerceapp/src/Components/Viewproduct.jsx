import React, { useState } from 'react'
import './Style.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import axios from 'axios'
import Nav from 'react-bootstrap/Nav';




const Viewproduct = () => {
  const[product,setProduct]=useState([]);

  axios.get('http://localhost:8080/product/viewproduct').then((response)=>{
    console.log(response.data.data); 
    setProduct(response.data.data);
  }).catch((error)=>{
    console.log(error);
    
  })
  console.log(product)

  const handleSubmit=(id)=>{
    axios.get(`http://localhost:8080/viewone/${id}`).then((response)=>{
      console.log(response);  
    }).catch((error)=>{
      console.log(error);
      
    })
  }
  return (
    <div>
      <div>
      <Container>
      <Row>
        {product.map((item)=>(

<Col>
<Card  className='productcard '>
<Card.Img variant="top" src={item.image[0]} className='productimage'/>
<Card.Body className='prdbodyStyle'>
<Card.Title className='prdtextspace'>{item.prdName}</Card.Title>
<Card.Text className='prdtextspace'>Prize:{item.prize}</Card.Text>
<Card.Text className='prdtextspace'>Size:{item.size}</Card.Text>
<Card.Text >Material:{item.material}</Card.Text>



{/* <Card.Text>
  Some quick example text to build on the card title and make up the
  bulk of the card's content.
</Card.Text> */}
<div className='text-center'>
< Card.Link href="" className='navtext'><Button variant="primary" size="sm" onClick={()=>handleSubmit(item._id)}>Add to cart</Button></Card.Link>
</div>
</Card.Body>
</Card>
</Col>


        ))}
       
      </Row>
      </Container>

      <div>
        
      </div>
        
      </div>
    </div>
  )
}

export default Viewproduct