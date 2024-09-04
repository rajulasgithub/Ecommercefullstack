import React, { useState } from 'react'
import './Style.css'
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import axios from 'axios'
import Header from './Header';





const Signup = () => {
const[signup,setSignup]= useState({
  firstname:"",
  number:"",
  state:"",
  district:"",
  place:"",
  pincode:"",
  gender:"",
  email:"",
  password:"",
})

const [error, setError] = useState({});


  const handleChange=(event)=>{
    // console.log(event.target.name)
    setSignup({...signup,[event.target.name]:event.target.value})
  }
  console.log(signup)

  
  
    const Validate = () => {
      const errormessage = {};
      if (!signup.firstname) {
        errormessage.firstname = "Enter Firstname";
      }
      if (!signup.number) {
        errormessage.number = "Enter Number";
      }
      if (!signup.state) {
        errormessage.state = "Enter State";
      }
      if (!signup.district) {
        errormessage.district = "Enter District";
      }
      if (!signup.place) {
        errormessage.place = "Enter Place";
      }
      if (!signup.pincode) {
        errormessage.pincode = "Enter Pincode";
      }
      if (!signup.gender) {
        errormessage.gender = "Enter Gender";
      }
      if (!signup.email) {
        errormessage.email = "Enter email";
      }
      if (!signup.password) {
        errormessage.password = "Enter password";
      }
      setError(errormessage)
      return Object.keys(errormessage).length===0
    };
  
  
    const handleSubmit = async () => {
      if (!Validate()) {
        console.log("error")
        return
      }
    
    axios.post('http://localhost:8080/auth/signup',signup).then((response)=>{
      console.log(response); 
    }).catch((error) => {
      console.log(error);
    });
  }


 
 
  return (
    <>
    <Header/>
    <div className='signupbg'>
        <div className='formdiv'> 
          {/* <div className='signuphead'> */}
        <div className='text-center text-white mb-4 signuphead'>Signup</div>
        {/* </div> */}
        <div className='forminnerdiv'>
      <Form className='text-center'>
        <div className="">
      <Row className="mb-4 justify-content-center">
        <Form.Group as={Col} sm={6} controlId="formGridEmail" className=' gridone ' >
        <Form.Label className="labelstyle">{error.firstname}</Form.Label>
        <Form.Control type="text" placeholder="Firstname" className='formborder'  name="firstname" onChange={handleChange}  />
        </Form.Group>
        
        <Form.Group as={Col} sm={6} controlId="formGridPassword" className='gridend' >
        <Form.Label className="labelstyle">{error.number}</Form.Label>
          <Form.Control type="text" placeholder="Number" className='formborder' name="number"  onChange={handleChange} />
        </Form.Group>
      </Row>
      </div>
      
      <Row className="mb-4 justify-content-center">
        <Form.Group as={Col} sm={4} controlId="formGridState" className='gridone'>
        <Form.Label className="labelstyle">{error.state}</Form.Label>
          <Form.Control type="text" placeholder="Enter State" className='formborder'  name="state" onChange={handleChange} />
        </Form.Group>

        <Form.Group as={Col} sm={4} controlId="formGridCity" className='gridone'>
        <Form.Label className="labelstyle">{error.district}</Form.Label>
          <Form.Control type="text" placeholder="Enter district" name="district" onChange={handleChange} />

        </Form.Group>
        <Form.Group as={Col} sm={4} controlId="formGridPassword" className='gridend'>
        <Form.Label className="labelstyle">{error.place}</Form.Label>
          <Form.Control type="text" placeholder="Enter Place" className='formborder' name="place" onChange={handleChange}/>
        </Form.Group>

       
      </Row>
      <Row className="mb-4 justify-content-center">
      <Form.Group as={Col} sm={6} controlId="formGridPincode" className='gridone'>
      <Form.Label className="labelstyle">{error.pincode}</Form.Label>
      <Form.Control type="text" placeholder="Enter Pincode"  className='formborder'  name="pincode"  onChange={handleChange}/>
        </Form.Group>

        <Form.Group as={Col} sm={6} controlId="formGridPassword" className='gridend'>
        <Form.Label className="labelstyle">{error.gender}</Form.Label>
          <Form.Control type="text" placeholder="enter Gender" className='formborder'  name="gender" onChange={handleChange}/>
        </Form.Group>
      </Row>
      <Row className="mb-4 justify-content-center">
        <Form.Group as={Col} sm={6} controlId="formGridEmail" className='gridone'>
        <Form.Label className="labelstyle">{error.email}</Form.Label>
          <Form.Control type="email" placeholder="Enter  Email" className='formborder' name="email" onChange={handleChange} />
        </Form.Group>

        <Form.Group as={Col} sm={6} controlId="formGridPassword" className='gridend'>
        <Form.Label className="labelstyle">{error.password}</Form.Label>
          <Form.Control type="password" placeholder="Enter Password" className='formborder'  name="password" onChange={handleChange} />
        </Form.Group>
      </Row>
      <Button variant="warning" size="sm"  className='btnstyle' onClick={handleSubmit} >
          SignUp
        </Button>
    </Form>
    </div>
    </div>
        
    </div>
    </>
  )
}

export default Signup