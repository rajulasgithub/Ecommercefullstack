import React from 'react'
import  { useEffect, useState } from "react";

import './Style.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import axios from 'axios'
import Modal from 'react-bootstrap/Modal';
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";



import InputGroup from 'react-bootstrap/InputGroup';
import Header from './Header';




const OrderSummary = () => {
  const navigate = useNavigate();
  const shippingdays=5;
  const[shippingname,setShippingname]=useState([]);
  const[shippinginfo,setShippinginfo]=useState([]);
  const [show, setShow] = useState(false);
  const[address,setAddress]=useState({});


const calshippingdays=(shippingdays)=>{
   const today= new Date();
   const deliveryDate = new Date();
   deliveryDate.setDate(today.getDate()+shippingdays)
  return  deliveryDate.toISOString().split('T')[0];
}
  
const[expdeliverydate,setExpdeliverydate]=useState(calshippingdays(shippingdays))

  useEffect(() => {
    const total=localStorage.setItem('total',(JSON.parse(localStorage.getItem('totalprize')))+40)
    const token=localStorage.getItem('token');
    const headers = {
      Authorization: `bearer ${token}`,
      // 'Content-Type':'application/json'
    };
   
axios.get('http://localhost:8080/auth/viewone',{headers:headers}).then((response)=>{
  console.log(response.data.data);
  setShippingname(response.data.data) 
  localStorage.setItem("number",shippingname.number)
}).catch((error)=>{
  console.log(error);
  
})

axios.get('http://localhost:8080/address/getaddress',{headers:headers}).then((response)=>{
  console.log(response.data.data);
  // setShippinginfo(response.data.data.address+","+"Building No:"+response.data.data.BuildingNumber+"pincode:"+response.data.data.pincode+","+"district:"+response.data.data.district+","+"state:"+response.data.data.state)
setShippinginfo(response.data.data);
localStorage.setItem('address',shippinginfo.address+" "+shippinginfo.district+" "+shippinginfo.state+" "+shippinginfo.BuildingNumber+" "+shippinginfo.pincode);
}).catch((error)=>{
  console.log(error);
})
console.log(shippinginfo)
  }, [])

 
  const conformOrder=()=>{
    const token=localStorage.getItem('token');
    console.log(token);
    const headers = {
      Authorization: `bearer ${token}`,
      // 'Content-Type':'application/json'
    };
    axios.put('http://localhost:8080/product/updatecart',{},{headers:headers}).then((response)=>{
      console.log(response);  
      setShippinginfo(shippinginfo);
    }).catch((error)=>{
      console.log(error);   
    })
    navigate('/vieworders')
  }


  const handleClose = () =>
    { 
      // const token = localStorage.getItem("token");

      // const headers = {
      //   Authorization: `bearer ${token}`,
      //   // 'Content-Type':'application/json'
      // };
      
      setShow(false);
    window.location.reload();

    }
  const handleShow = () => setShow(true);
  
  const handleChange=(event)=>{
     console.log(event);
     setAddress({...address,[event.target.name]:event.target.value});

  }
  console.log(address)

  const updateAdrress=(event)=>{
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `bearer ${token}`,
      // 'Content-Type':'application/json'
    };
    axios.put('http://localhost:8080/address/changedeliveryaddress',address,{headers:headers}).then((response)=>{
      console.log(response.data.data);
    }).catch((error)=>{
      console.log(error)
    })
  }
 

  return (
    <>
    <Header/>
    <div className='odrsmryback'>
      <div className='pgstopflex'>
        <div className='progressflex'>
        <div>
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" style={{color:"blue"}} fill="currentColor" class="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
  <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
</svg>
</div>

  <div>
    <div className='progressbar'>
      .
    </div>
  </div>
  </div>

  <div className='progressflex'>
  <div>
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" style={{color:"blue"}} fill="currentColor" class="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
  <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
</svg>
</div>
<div>
    <div className='progressbarone'>
      .
    </div>
  </div>
</div>

 
  <div >
  <div>
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" style={{color:"grey"}} fill="currentColor" class="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
  <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
</svg>
</div>

</div>


  </div>
        <div>
        <Container>
      <Row className='pt-5'>
      <Col>
      <div className='ordercolone'>
        <div className='odraddrsflex pt-4 ps-4 pe-4'>
        <h3>deliver to:{" "+shippingname.firstname}</h3>
        <Button variant="outline-primary" onClick={handleShow} >Change</Button>{' '}
        <Modal show={show} onHide={handleClose} backdrop="static"
        >
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              {/* <Form.Label>Name</Form.Label> */}
              <Form.Control
                type="text"
                placeholder="Enter Name"
                autoFocus
                name='firstname' 
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              {/* <Form.Label>Enter Delivery Address</Form.Label> */}
              <Form.Control as="textarea" rows={2} placeholder='Enter Address'  name='address'  onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              {/* <Form.Label> Building Number</Form.Label> */}
              <Form.Control
                type="text"
                placeholder="Enter Building Number"
                autoFocus 
                name='BuildingNumber'
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              {/* <Form.Label> State</Form.Label> */}
              <Form.Control
                type="text"
                placeholder="Enter State"
                autoFocus
                name='state'
                onChange={handleChange}
                
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              {/* <Form.Label> District</Form.Label> */}
              <Form.Control
                type="text"
                placeholder="Enter District"
                autoFocus
                name='district'
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              {/* <Form.Label> Pincode</Form.Label> */}
              <Form.Control
                type="text"
                placeholder="Enter Pincode "
                autoFocus
                name='pincode'
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              {/* <Form.Label> Phone</Form.Label> */}
              <Form.Control
                type="text"
                placeholder="Enter phone Number"
                autoFocus
                name='number'
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={updateAdrress}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
        </div>
        <div className=' ps-4 pe-4'>
       <h4>Address:</h4>
       <div className='adrsdiv pe-5'>
       <p className='fw-bold'>{shippinginfo.address} </p>

       <p className='fw-bold'>{"Building No:"+shippinginfo.BuildingNumber}</p>

        </div>
       <p className='fw-bold'>{shippinginfo.district+','+shippinginfo.state+','+shippinginfo.pincode}</p>
       </div>
       <h6 className='ps-4 pb-5 fw-bold'>Phone:{shippingname.number}</h6>

      </div>
      
      </Col>
      <Col>
      <div className='ordercoltwo'>
      <div className=''><h6 className='ps-5 pt-5 fw-bold'>Expected Delivery Date:{""+expdeliverydate}</h6></div>
       <div className='odraddrsflex pt-3 ps-5 pe-5'>
       <h6 className='fw-bold'>Price Of({localStorage.getItem('itemcount')})</h6>
       <h6 className='fw-bold'>{localStorage.getItem('totalprize')}</h6>
       </div>
       <div className='odraddrsflex pt-3 ps-5 pe-5'>
       <h6 className='fw-bold'>Delivery Charges:</h6>
       <h6 className='fw-bold'>RS.40</h6>
       </div>
       <div className='odraddrsflex pt-3 ps-5 pe-5 pb-3'>
       <h6 className='fw-bold'>Total:</h6>
       <h6 className='fw-bold'>{
       (JSON.parse(localStorage.getItem('totalprize')))+40}</h6>
       </div>
       <div>
        <h4 className='ps-5 fw-bold'>Payment Method</h4>
        
        <div className='radioflex ps-5 fw-bold'>
     <label class="form-check-label" for="flexRadioDefault1">
       Cash On delivery
     </label>
      <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" className='me-5'/>

        </div>
        <div className='radioflex ps-5 fw-bold'>
     <label class="form-check-label" for="flexRadioDefault1">
       UPI
     </label>
      <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1"  className='me-5'/>

        </div>
        <div className='radioflex ps-5 fw-bold'>
     <label class="form-check-label" for="flexRadioDefault1">
      Net Banking
     </label>
      <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1"  className='me-5'/>

        </div>
        <div className='radioflex ps-5 fw-bold'>
     <label class="form-check-label" for="flexRadioDefault1">
       Credit/Debit/ATM Card
     </label>
      <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" className='me-5'/>

        </div>
        </div>
       <div className='text-center pb-4'>
       <Button variant="warning"  onClick={conformOrder}>Conform Order</Button>{' '}
       </div>
         
        </div>
      </Col>


        
      </Row>
      </Container>

        </div>
    </div>
    </>
  )
}

export default OrderSummary