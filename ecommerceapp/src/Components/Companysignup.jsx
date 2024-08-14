import React, { useState } from 'react'
import './Style.css'
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import axios from 'axios'

const Companysignup = () => {
  const[companysignup,setCompanysignup]=useState({})
  const handleChange=(event)=>{
    // console.log(event.target.value)
    setCompanysignup({...companysignup, [event.target.name]: event.target.value })
  }
 

  const fileChange=(event)=>{
     setCompanysignup({...companysignup,image:event.target.files[0]})
  }
  console.log(companysignup);

  const formdata= new FormData();
  formdata.append("image",companysignup.image)
  formdata.append("companyName",companysignup.companyName)
  formdata.append("state",companysignup.state)
  formdata.append("district",companysignup.district)
  formdata.append("pincode",companysignup.pincode)
  formdata.append("contactNumber",companysignup.contactNumber)
  formdata.append("regNumber",companysignup.regNumber)
  formdata.append("gstNumber",companysignup.gstNumber)

  for (const [key, value] of formdata.entries()) {
    console.log(`${key}: ${value}`);
}
 

  const handleSubmit=(event)=>{
    axios.post('http://localhost:8080/auth/companysignup',formdata).then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
  }
  
  return (
    <div className='signupbg'>
        <div className='companysignupformdiv'>
        <div className='forminnerdiv'>
        <form  className='text-center formtext' encType="multpart/form-data"   onSubmit={handleSubmit}>
        {/* <Form  > */}
        <div className='text-center text-white mb-4 signuphead'>Login</div>

        <Row className="mb-3 justify-content-center">
        
        <Form.Group  as={Col} sm={5} className='gridone'>
        {/* <Form.Label>Default file input example</Form.Label> */}
        <Form.Control type="file"  name="image"  onChange={fileChange}/>
      </Form.Group>
      

        <Form.Group as={Col} sm={5}  className='compsigngridend' >
          {/* <Form.Label>Password</Form.Label> */}
          <Form.Control type="text" placeholder="Company Name "  name="companyName" onChange={handleChange} />
        </Form.Group>
      </Row>
      <Row className="mb-3 justify-content-center">
        <Form.Group as={Col} sm={5} className='gridone'>
          {/* <Form.Label>Email</Form.Label> */}
          <Form.Control type="text" placeholder="Enter State"  name="state" onChange={handleChange}  />
        </Form.Group>

        <Form.Group as={Col} sm={5}  className='compsigngridend '>
          {/* <Form.Label>Password</Form.Label> */}
          <Form.Control type="text" placeholder="Enter District" name="district" onChange={handleChange}/>
        </Form.Group>
      </Row>
      <Row className="mb-3 justify-content-center">
        <Form.Group as={Col} sm={5} className='gridone'>
          {/* <Form.Label>Email</Form.Label> */}
          <Form.Control type="text" placeholder="Enter Pincode" name="pincode" onChange={handleChange} />
        </Form.Group>

        <Form.Group as={Col} sm={5}  className='compsigngridend '>
          {/* <Form.Label>Password</Form.Label> */}
          <Form.Control type="text" placeholder="Enter Number"  name="contactNumber" onChange={handleChange} />
        </Form.Group>
      </Row>
      <Row className="mb-3 justify-content-center">
        <Form.Group as={Col} sm={5}  className='gridone'>
          {/* <Form.Label>Email</Form.Label> */}
          <Form.Control type="text" placeholder="Enter Register Number"  name="regNumber" onChange={handleChange} />
        </Form.Group>

        <Form.Group as={Col} sm={5}   className='compsigngridend '>
          {/* <Form.Label>Password</Form.Label> */}
          <Form.Control type="text" placeholder="Enter GST Number"  name="gstNumber" onChange={handleChange} />
        </Form.Group>
      </Row>
      <Row className="mb-3 justify-content-center">
        <Form.Group as={Col} sm={5}  className='gridone'>
          {/* <Form.Label>Email</Form.Label> */}
          <Form.Control type="email" placeholder="Enter Email" name="email" onChange={handleChange} />
        </Form.Group>

        <Form.Group as={Col} sm={5}   className='compsigngridend '>
          {/* <Form.Label>Password</Form.Label> */}
          <Form.Control type="password" placeholder="Enter Password" name="password" onChange={handleChange} />
        </Form.Group>
      </Row>

      <Button variant="warning" size="sm"  className='btnstyle mt-3' type='submit'>
          Signup
        </Button>
      {/* </Form> */}
      </form>
      </div>

        </div>
    </div>
  )
}

export default Companysignup