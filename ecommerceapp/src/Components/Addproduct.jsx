import React, { useState } from 'react'
import Form from 'react-bootstrap/Form';
import './Style.css'
import Button from 'react-bootstrap/Button';
// import Image from 'react-bootstrap/Image';
// import Col from 'react-bootstrap/Col';
import axios from 'axios'
import Header from './Header';





const Addproduct = () => {
const[addproduct,setAddproduct]=useState({})
  const handleChange=(event)=>{
    
    setAddproduct({...addproduct,[event.target.name]:event.target.value})

  }
  
 const fileChange=(event)=>{
  setAddproduct({...addproduct,image:event.target.files[0]})
 }

  const formdata= new FormData();
  formdata.append('prdName',addproduct.prdName)
  formdata.append('image',addproduct.image)
  formdata.append('prize',addproduct.prize)
  formdata.append('size',addproduct.size)
  formdata.append('material',addproduct.material)
  



  console.log(addproduct);
  
const handleSubmit= async (event)=>{
  event.preventDefault();

  axios.post('https://ecommercefullstack-xv9x.onrender.com/product/addproduct',formdata).then((response)=>{
    console.log(response);   
  }).catch((error)=>{
    console.log(error);
    
  })
}
  
  return (
    <>
    <Header/>
    <div className='addprdform'>
        <div className='addproducmaindiv'>
          <div className='addprdtsubdiv'>
        <Form  encType="multpart/form-data"  onSubmit={handleSubmit}>
          <h2 className='text-center mb-5 ' style={{fontFamily:"monospace"}}>Add Product</h2>
       {/* <Form.Group className="mb-3" as={Col} sm={12}>
        <Form.Label></Form.Label> 
        <Form.Control type="file" placeholder="Product Image"   name='image'  />
      </Form.Group>  */}
      {/* <div className='text-center'>
      <input type='file'  placeholder="Product Image" name='image' className='mb-3' addprdformstyle ></input>
      </div> */}
      <Form.Group className="mb-3 addformfile " >
        {/* <Form.Label>Default file input example</Form.Label> */}
        <Form.Control type="file"  name="image"  onChange={fileChange} />
      </Form.Group>
      <Form.Group className="mb-3 addprdformstyle ">
        {/* <Form.Label>product name</Form.Label> */}
        <Form.Control type="text" placeholder="Product Name" className='text-center'   name='prdName' onChange={handleChange} />
      </Form.Group>
      <Form.Group className="mb-3 addprdformstyle">
        {/* <Form.Label>product name</Form.Label> */}
        <Form.Control type="text" placeholder="Product Prize" className='text-center'  name='prize' onChange={handleChange} />
      </Form.Group>
      <Form.Group className="mb-3 addprdformstyle">
        {/* <Form.Label>product name</Form.Label> */}
        <Form.Control type="text" placeholder="Product Size" className='text-center'  name='size' onChange={handleChange}  />
      </Form.Group>
      <Form.Group className="mb-3 addprdformstyle">
        {/* <Form.Label>product name</Form.Label> */}
        <Form.Control type="text" placeholder="Product Material" className='text-center'  name='material' onChange={handleChange} />
      </Form.Group>
      <div className='text-center addprdbtnstyle '>
      <Button variant="success" size="sm" type='submit'>Add Product</Button>{' '}
      </div>
    </Form>
    </div>
    <div>
   
    </div>
    </div>
    </div>
    </>
  )
}

export default Addproduct