import React, { useState,useEffect } from 'react'
import './Style.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import axios from 'axios'
import Nav from 'react-bootstrap/Nav';
import {useNavigate} from 'react-router-dom'
import Header from './Header';
import Modal from 'react-bootstrap/Modal';
import Form from "react-bootstrap/Form";




const Viewproduct = () => {
  const role= localStorage.getItem("role");

  const navigate=useNavigate();
  const[product,setProduct]=useState([]);
  const[updateprdt,setUpdateprdt]=useState({});
  const [show, setShow] = useState(false);

  // const[cart,setAddtocart]=useState("");
 useEffect(() => {
  axios.get('https://ecommercefullstack-xv9x.onrender.com/product/viewproduct').then((response)=>{
    console.log(response.data.data); 
    setProduct(response.data.data);
  }).catch((error)=>{
    console.log(error);
    
  })
 
   
 }, [])
 
  
  console.log(product)
  const token= localStorage.getItem('token')
  
  // setAddtocart(localStorage.getItem('token'));
  // console.log(token);

  const handleSubmit=(id)=>{
    const prdId={productId:id}
    const headers={
      'Authorization':`bearer ${token}`,
      // 'Content-Type':'application/json'
    }
    
    axios.post(`https://ecommercefullstack-xv9x.onrender.com/product/addtocart`,prdId,{
      headers:headers
    }).then((response)=>{
      console.log(response);
      navigate('/cart')
      
    }).catch((error)=>{
      console.log(error);
      
    })
  }

const dltproduct=(id)=>{
  console.log(id);
   axios.put(`https://ecommercefullstack-xv9x.onrender.com/product/deleteproduct/${id}`).then((response)=>{
    console.log(response);
    window.location.reload();
   }).catch((error)=>{
    console.log(error);  
   })
}
// const updateproduct=(id)=>{
//   console.log(id);
//   axios.put(`http://localhost:8080/product/updateproduct/${id}`).then((response)=>{
//     console.log(response);
//   }).catch((error)=>{
//     console.log(error);  
//   })
// }


const handleChange=(event)=>{
  console.log(event);
  setUpdateprdt({...updateprdt,[event.target.name]:event.target.value});
}

const fileChange=(event)=>{
  setUpdateprdt({...updateprdt,image:event.target.files[0]})
 }

 const formdata= new FormData();
 formdata.append('prdName',updateprdt.prdName)
 formdata.append('image',updateprdt.image)
 formdata.append('prize',updateprdt.prize)
 formdata.append('size',updateprdt.size)
 formdata.append('material',updateprdt.material)


 const handleUpdate=(id)=>{
   axios.put(`https://ecommercefullstack-xv9x.onrender.com/product/updateproduct/${id}`,formdata).then((response)=>{
    console.log(response.data.data);  
   }).catch((error)=>{
     console.log(error);
   })
 }


const handleClose = () =>
  {  
  setShow(false);
  window.location.reload();
  }


const handleShow = () => setShow(true);

const setStatus=(id,value)=>{
  console.log(value);
     axios.put(`https://ecommercefullstack-xv9x.onrender.com/product/updateproductstatus/${id}/${value}`).then((response)=>{
      console.log(response);
      
     }).catch((error)=>{
      console.log(error);
      
     })

     window.location.reload();

}

  return (
    <div>
      <Header/>
      <div className='viewproductback'>
    
        <div>
      <div className='viewprdtdiv'>
       {role==2?
      
      <Container >
      <Row style={{columnGap:30}}>
      {product.map((item)=>(
      <Card style={{ width: '15rem',paddingTop:15,marginBottom:30 }} className='viewprdctcards' >
      <Col sm>
      <Card.Img variant="top" src={item.image[0]} style={{width:180,height:150,marginLeft:15}}/>
      <Card.Body>
        <Card.Title className='text-success'>{item.prdName}</Card.Title>
        <Card.Text className='text-danger '>
       Prize: {item.prize}
       
        </Card.Text>
        <Card.Text>
        Size:{item.size}
        </Card.Text>
        <Card.Text>
       Material: {item.material}
       
        </Card.Text>
        {item.status!==6?
        <>
        <Button  size="sm" variant="outline-success" onClick={()=>handleSubmit(item._id)}>Add to Cart</Button>
        </>:
        <Button  size="sm" variant="danger" >Out Of Stock</Button>

}
        </Card.Body>
      </Col>
    </Card>
        
       
      ))}
      </Row>
      </Container>:
      
      <Container >
      <Row style={{columnGap:30}}>
      {product.map((item)=>(
      <Card style={{ width: '15rem',paddingTop:15,marginBottom:30 }} className='viewprdctcards' >
      <Col sm>
      <Card.Img variant="top" src={item.image[0]} style={{width:180,height:150,marginLeft:15}}/>
      <Card.Body>
        <Card.Title className='text-success'>{item.prdName}</Card.Title>
        <Card.Text className='text-danger '>
       Prize: {item.prize}
       
        </Card.Text>
        <Card.Text>
        Size:{item.size}
        </Card.Text>
        <Card.Text>
       Material: {item.material}
       </Card.Text>
        <>
        {item.status!==6?
        <div className='viewprdctbtn'>
        <Button  size="sm" variant="outline-success" onClick={()=>dltproduct(item._id)} >Delete</Button>
        <Button  size="sm" variant="outline-success" onClick={handleShow}>Update</Button>
        <Modal show={show} onHide={handleClose} backdrop="static"
        >
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Control
                type="text"
                placeholder="Product Name"
                autoFocus
                name='prdName' 
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Control type="file"  placeholder='choose image'  name='image'  onChange={fileChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Control
                type="text"
                placeholder="Prize"
                autoFocus 
                name='prize'
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Control
                type="text"
                placeholder="Size"
                autoFocus
                name='size'
                onChange={handleChange}
                
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Control
                type="text"
                placeholder="Material"
                autoFocus
                name='material'
                onChange={handleChange}
              />
            </Form.Group>
            
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={()=>handleUpdate(item._id)}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
        </div>:
        <>
        <Form.Select aria-label="Default select example" name="status" onChange={(e)=>setStatus(item._id,e.target.value)} >
        <option  >Out Of Stock</option>
        <option value="0" >Add Product</option>
    
      
        </Form.Select>
        {/* <Button variant="danger">Out of Stock</Button> */}
        </>
}
        </>
      </Card.Body>
      </Col>
    </Card>
          
      ))}
      </Row>
      </Container>
    
}

      </div>
      </div>
        
      </div>
    </div>
  )
}

export default Viewproduct