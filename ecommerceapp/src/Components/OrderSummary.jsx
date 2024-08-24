import React from 'react'
import  { useEffect, useState } from "react";

import './Style.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import axios from 'axios'



const OrderSummary = () => {
  const shippingdays=5;
  const[shippingname,setShippingname]=useState([]);
  const[shippinginfo,setShippinginfo]=useState([]);

const calshippingdays=(shippingdays)=>{
   const today= new Date();
   const deliveryDate = new Date();
   deliveryDate.setDate(today.getDate()+shippingdays)
  return  deliveryDate.toISOString().split('T')[0];
}
  
const[expdeliverydate,setExpdeliverydate]=useState(calshippingdays(shippingdays))

  useEffect(() => {
    const token=localStorage.getItem('token');
    const headers = {
      Authorization: `bearer ${token}`,
      // 'Content-Type':'application/json'
    };
   
axios.get('http://localhost:8080/auth/viewone',{headers:headers}).then((response)=>{
  console.log(response.data.data);
  setShippingname(response.data.data) 
}).catch((error)=>{
  console.log(error);
  
})

axios.get('http://localhost:8080/address/getaddress',{headers:headers}).then((response)=>{
  // console.log(response.data.data);
  // setShippinginfo(response.data.data.address+","+"Building No:"+response.data.data.BuildingNumber+"pincode:"+response.data.data.pincode+","+"district:"+response.data.data.district+","+"state:"+response.data.data.state)
setShippinginfo(response.data.data);
}).catch((error)=>{
  console.log(error);
})
console.log(shippinginfo)
  }, [])

 
  const conformOrder=()=>{
    const token=localStorage.getItem('token');
    const headers = {
      Authorization: `bearer ${token}`,
      // 'Content-Type':'application/json'
    };
    axios.put('http://localhost:8080/product/updatecart',{headers:headers}).then((response)=>{
      console.log(response);  
    }).catch((error)=>{
      console.log(error);   
    })
  }
  

  return (
    <div className='odrsmryback'>
      <div>
        {/* <div>
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" style={{color:"blue"}} fill="currentColor" class="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
  <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
</svg>
</div>
<div>
  <h5>Order Summary</h5>
  </div>
  <div>
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" style={{color:"blue"}} fill="currentColor" class="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
  <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
</svg>
</div>
<div>
  <h5>Order Summary</h5>
  </div>
  <div className='line '><h6>_</h6></div>
  <div>
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" style={{color:"blue"}} fill="currentColor" class="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
  <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
</svg>
</div>
<div>
  <h5>Order Summary</h5>
  </div> */}
  </div>
        <div>
        <Container>
      <Row className='pt-5'>
      <Col>
      <div className='ordercolone'>
        <div className='odraddrsflex pt-4 ps-4 pe-4'>
        <h5>deliver to:{" "+shippingname.firstname+" "+shippingname.lastname}</h5>
        <Button variant="outline-primary">Change</Button>{' '}
        </div>
        <div className=' ps-4 pe-4'>
       <h5>Address:</h5>
       <div className='adrsdiv pe-5'>
        {shippinginfo.address+","+""+"Building No:"+shippinginfo.BuildingNumber}
        </div>
       <p>{shippinginfo.district+','+shippinginfo.state+','+shippinginfo.pincode}</p>
       </div>
       <h6 className='ps-4 pb-5'>Phone:{shippingname.number}</h6>

      </div>
      </Col>
      <Col>
      <div className='ordercoltwo'>
      <div className=''><h6 className='ps-5 pt-5'>Expected Delivery Date:{""+expdeliverydate}</h6></div>
       <div className='odraddrsflex pt-3 ps-5 pe-5'>
       <h6>Price Of({localStorage.getItem('itemcount')})</h6>
       <h6>{localStorage.getItem('totalprize')}</h6>
       </div>
       <div className='odraddrsflex pt-3 ps-5 pe-5'>
       <h6>Delivery Charges:</h6>
       <h6>RS.40</h6>
       </div>
       <div className='odraddrsflex pt-3 ps-5 pe-5 pb-3'>
       <h6>Total:</h6>
       <h6>{
       (localStorage.getItem('totalprize'))}</h6>
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
  )
}

export default OrderSummary