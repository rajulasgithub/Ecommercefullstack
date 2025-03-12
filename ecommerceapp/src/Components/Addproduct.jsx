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
    <div className='addprdform' style={{backgroundColor:"white"}}>
        <div className='addproducmaindiv' >
          <div className='addprct'>
          <div className='addprdtsubdiv'>
        <Form  encType="multpart/form-data"  onSubmit={handleSubmit}>
          <h2 className='text-center mb-5 ' style={{fontFamily:"monospace"}}>ADD PRODUCT</h2>
      
      <Form.Group className="mb-3 addformfile " style={{boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}} >
        <Form.Control type="file"  name="image"  onChange={fileChange} />
      </Form.Group>
      <Form.Group className="mb-3 addprdformstyle " style={{boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}>
        <Form.Control type="text" placeholder="Product Name" className='text-center'   name='prdName' onChange={handleChange} />
      </Form.Group>
      <Form.Group className="mb-3 addprdformstyle" style={{boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}} >
        <Form.Control type="text" placeholder="Product Prize" className='text-center'  name='prize' onChange={handleChange} />
      </Form.Group>
      <Form.Group className="mb-3 addprdformstyle" style={{boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}>
        <Form.Control type="text" placeholder="Product Size" className='text-center'  name='size' onChange={handleChange}  />
      </Form.Group>
      <Form.Group className="mb-3 addprdformstyle" style={{boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}>
        <Form.Control type="text" placeholder="Product Material" className='text-center'  name='material' onChange={handleChange} />
      </Form.Group>
      <div className='text-center addprdbtnstyle ' >
      <Button variant="success" size="sm" type='submit'>Add Product</Button>{' '}
      </div>
    </Form>
    </div>
    </div>
    <div className='addprdctres'>
    <div className='addprdtsubdiv'>
        <Form  encType="multpart/form-data"  onSubmit={handleSubmit}>
          <h2 className=' mb-5 ' style={{fontFamily:"monospace",marginLeft:"6rem"}}>ADD PRODUCT</h2>
      
      <Form.Group className="mb-3 addprdformstyle " style={{boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",width:"300px"}} >
        <Form.Control type="file"  name="image"  onChange={fileChange} />
      </Form.Group>
      <Form.Group className="mb-3   addprdformstyle " style={{boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",width:"300px"}}>
        <Form.Control type="text" placeholder="Product Name" className='text-center'   name='prdName' onChange={handleChange} />
      </Form.Group>
      <Form.Group className="mb-3 addprdformstyle" style={{boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",width:"300px"}} >
        <Form.Control type="text" placeholder="Product Prize" className='text-center'  name='prize' onChange={handleChange} />
      </Form.Group>
      <Form.Group className="mb-3 addprdformstyle" style={{boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",width:"300px"}}>
        <Form.Control type="text" placeholder="Product Size" className='text-center'  name='size' onChange={handleChange}  />
      </Form.Group>
      <Form.Group className="mb-3 addprdformstyle" style={{boxShadow:"0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",width:"300px"}}>
        <Form.Control type="text" placeholder="Product Material" className='text-center'  name='material' onChange={handleChange} />
      </Form.Group>
      <div className=' addprdbtnstyle ' style={{marginLeft:"8rem"}} >
      <Button variant="success" size="sm" type='submit'>Add Product</Button>{' '}
      </div>
    </Form>
    </div>
      
    </div>
    <div>
   
    </div>
    </div>
    </div>
    </>
  )
}

export default Addproduct