import React from 'react'
import Form from 'react-bootstrap/Form';
import './Style.css'
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';




const Addproduct = () => {
  return (
    <div>
        <div className='addproducmaindiv'>
          <div className='addprdtsubdiv'>
        <Form>
      <Form.Group className="mb-3">
        {/* <Form.Label></Form.Label> */}
        <Form.Control type="file" placeholder="Product Image"   name='image'  />
      </Form.Group>
      <Form.Group className="mb-3 addprdformstyle ">
        {/* <Form.Label>product name</Form.Label> */}
        <Form.Control type="text" placeholder="Product Name" className='text-center'   name='prdName' />
      </Form.Group>
      <Form.Group className="mb-3 addprdformstyle">
        {/* <Form.Label>product name</Form.Label> */}
        <Form.Control type="text" placeholder="Product Prize" className='text-center'  name='prize' />
      </Form.Group>
      <Form.Group className="mb-3 addprdformstyle">
        {/* <Form.Label>product name</Form.Label> */}
        <Form.Control type="text" placeholder="Product Size" className='text-center'  name='size' />
      </Form.Group>
      <Form.Group className="mb-3 addprdformstyle">
        {/* <Form.Label>product name</Form.Label> */}
        <Form.Control type="text" placeholder="Product Material" className='text-center'  name='material' />
      </Form.Group>
      <div className='text-center addprdbtnstyle '>
      <Button variant="outline-success" size="sm">Add Product</Button>{' '}
      </div>
    </Form>
    </div>
    <div>
   
    </div>
    </div>
    </div>
  )
}

export default Addproduct