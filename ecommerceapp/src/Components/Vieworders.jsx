import React, { useEffect, useState } from 'react'
import './Style.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from "react-bootstrap/Card";
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Header from './Header';
import ListGroup from 'react-bootstrap/ListGroup';






const Vieworders = () => {
  const role=localStorage.getItem('role')
 const adrs= localStorage.getItem('address')

 const[order,setOrder]=useState([]);
 const [filteredData, setFilteredData] = useState([]);
 const[filterstatus,setFilterstatus] = useState([]);
 const [status, setStatus] = useState('');
 const[address,setAddress]=useState({})

 useEffect(()=>{

  const token=localStorage.getItem('token');
  console.log(token);
  const headers = {
    Authorization: `bearer ${token}`,
    // 'Content-Type':'application/json'
  };
 
  axios.get('http://localhost:8080/product/viewcartcmpny').then((response)=>{
    console.log(response.data.data);
    setOrder(response.data.data)
    
  }).catch((error)=>{
    console.log(error);
    
  })
  
  axios.get('http://localhost:8080/product/vieworderuser',{headers:headers}).then((response)=>{
    console.log(response.data.data)
    setOrder(response.data.data)
  }).catch((error)=>{
    console.log(error);
    
  })

 },[])

 useEffect(()=>{
  const filtered = order.filter(item => item.status == 2 || item.status==3 || item.status==4 || item.status==5);
  setFilteredData(filtered);
 },[order])
 console.log(filteredData)

 

 
 const cancelOrder=(id)=>{
  // const token=localStorage.getItem('token');
  // // console.log(token);
  // const headers = {
  //   Authorization: `bearer ${token}`,
  //   // 'Content-Type':'application/json'
  // };
   axios.put(`http://localhost:8080/product/cancelorder/${id}`).then((response)=>{
    console.log(response); 
  
   }).catch((error)=>{
    console.log(error);
   })
   window.location.reload();
 }


 const rejectOrder=(id)=>{
//   console.log(id);
  // const token=localStorage.getItem('token');
  // // console.log(token);
  // const headers = {
  //   Authorization: `bearer ${token}`,
  //   // 'Content-Type':'application/json'
  // };
//    axios.put(`http://localhost:8080/product/rejectorder/${id}`).then((response)=>{
//       console.log(response);  
//    }).catch((error)=>{
//     console.log(error);
    
//    })
 }

 const statusChange=(id,value)=>{
 axios.put(`http://localhost:8080/product/updatecartstatus/${id}/${value}`).then((response)=>{
  console.log(response);
 window.location.reload();

 }).catch((error)=>{
  console.log(error);
 })
 }
 console.log(status)


 const buttonStyle = {
  backgroundColor:  'green', // Change color if status is 3
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

  
  return (
    <div>
      <Header/>
      <div>
      <div className="cartinnerdiv ">
         
          {role==2?
          <>
           <div className="carthead">
            <h4 style={{ fontFamily: "monospace" }} className="">
             Order history
            </h4>
            <h6 style={{ fontFamily: "monospace" }} className="">
              {} No Of Orders
            </h6>
          </div>
        
          <Container>
             <div className='orderbtns'>
            <Row>
              <Col sm={10} className="cartcolstyleone me-5">
                <div className="carttitlebartop">
                  {/* <div className="carttitlebar"> */}
                  {/* <div><h6>item</h6></div>

                  <div><h6 className="ms-5">size</h6></div>

                  <div><h6 className=" ms-5">prize</h6></div>
                  <div> <h6 className=" ">Quantity </h6></div>
                  <div><h6 className="">total </h6></div>
                  <div><h6 className="">Address </h6></div>
                  <div> <h6 className="">paymentMode </h6></div>
                  <div><h6 className="">Status </h6></div> */}




                  {/* </div> */}
                </div>
                
                {filteredData.map((item) => (
                  <Card
                    style={{ maxwidth: "50rem", height: "auto" }}
                    className="mt-5 cartcardstyle"
                  >
                    <div className="cardflex">
                      <div>
                        <Card.Img
                          variant="top"
                          src={item.prdId.image[0]}
                          style={{ width: "15rem", height: "15rem",paddingTop:'1rem' }}
                          className="img-rounded ms-3"
                        />
                         <Card.Text style={{ fontFamily: "monospace",marginLeft:'1rem' }} >
                          
                          {item.prdId.prdName}
                          </Card.Text>
                      </div>

                      <Card.Body>
                        <div className="cardhead">
                          
                        </div>
                        <div className="cardtext ">
                        {/* <Container> */}
                        {/* <Row> */}
                      
                          {/* <Col > */}
                       
                          {/* </Col> */}
                          {/* <Col  > */}
                          {/* <Card.Text style={{ fontFamily: "monospace" }}className=''>
                            Size
                            {item.prdId.size}
                          </Card.Text> */}
                          {/* </Col> */}
                          {/* <Col  > */}
                            <Card.Text style={{ fontFamily: "monospace" }} className=''>
                              prize:
                              {" "+item.prdId.prize}
                            </Card.Text>
                            {/* </Col> */}
                            {/* <Col  > */}
                            <Card.Text style={{ fontFamily: "monospace" }} className=''>
                              Qnty:
                              {" "+item.quantity}
                            </Card.Text>
                            {/* </Col>
                          
                            <Col  > */}
                            <Card.Text style={{ fontFamily: "monospace" }} className=''>
                              {/* {item.prdId.prize * item.quantity} */}
                              total
                             {" "+item.quantity*item.prdId.prize}
                            </Card.Text>
                            {/* </Col>
                            <Col  > */}
                            {/* <Card.Text style={{ fontFamily: "monospace" }} >
                              {item.prdId.prize * item.quantity}
                              Address
                              {address.address}
                              <br/>
                              {address.district}
                              {address.state}
                              <br/>
                              {address.pincode}
                              {address.BuildingNumber}
                              <br/>
                              876564567
                              
                            </Card.Text> */}
                          {/* </Col>
                          <Col  > */}
                            <Card.Text style={{ fontFamily: "monospace" }} className=''>
                              {/* {item.prdId.prize * item.quantity} */}
                              payment
                            </Card.Text>
                            <Card.Text style={{ fontFamily: "monospace" }} className=''>
                              {/* {item.prdId.prize * item.quantity} */}
                              Order Date:
                            </Card.Text>
                            <Card.Text style={{ fontFamily: "monospace" }} className=''>
                              {/* {item.prdId.prize * item.quantity} */}
                               Delivery Date:
                            </Card.Text>
                            {/* </Col>
                            <Col  > */}

                           <Card.Text style={{ fontFamily: "monospace" }} className=''>
                            status: { item.status==3?("Order Cancelled"): item.status==4? ("Processing"): item.status==5? ("out for delivery"): ("Ordered")}
                            </Card.Text>
                            
      {/* <select value={status}  className=''>
        <option value="" >Status</option>
        <option value="option1">Processing</option>
        <option value="option2">Out For Delivery</option>
        <option value="option3">Deliverd</option>
      </select> */}
                          {/* </Col>
                          <Col  > */}
                          
                          {/* </Col> */}
                       
                        {/* </Row> */}
                        {/* </Container> */}
                        </div>
                        
                      </Card.Body>
                    </div>
                    {item.status===3?
                    <div>
                    <Button
                      variant="primary"
                      size="lg"
                      className="cartbtnstyle "
                     onClick={()=>cancelOrder(item._id)}
                    >
                     Cancelled
                    </Button>
              </div>:
                          <div>
                          <Button
                            variant="primary"
                            size="lg"
                            className="cartbtnstyle "
                           onClick={()=>cancelOrder(item._id)}
                          >
                           Cancel Order
                          </Button>
                    </div>
}
                  </Card>
                 ))}  
              </Col> 
            </Row>
            <div>
              
                          <div>
                          <Button
                            variant="primary"
                            size="lg"
                            className="cartbtnstyle mb-3"
                           
                          >
                            Track your Order
                          </Button>
                          </div>
                          <div>
                          <Button
                            variant="primary"
                            size="lg"
                            className="cartbtnstyle "
                           
                          >
                            Change Delivery date
                          </Button>
                          </div>
          
          </div>
          </div>
          </Container>
          
          </>:
          <>
           <div className="carthead">
            <h4 style={{ fontFamily: "monospace" }} className="">
             Order's
            </h4>
            <h6 style={{ fontFamily: "monospace" }} className="">
              {} No Of Orders
            </h6>
          </div>
          
           <Container>
            <Row>
              <Col sm={12} className="cartcolstyleone me-5">
                <div className="carttitlebartop">
                  {/* <div className="carttitlebar"> */}
                  {/* <div><h6>item</h6></div>

                  <div><h6 className="ms-5">size</h6></div>

                  <div><h6 className=" ms-5">prize</h6></div>
                  <div> <h6 className=" ">Quantity </h6></div>
                  <div><h6 className="">total </h6></div>
                  <div><h6 className="">Address </h6></div>
                  <div> <h6 className="">paymentMode </h6></div>
                  <div><h6 className="">Status </h6></div> */}




                  {/* </div> */}
                </div>
                <ListGroup as="ol">
                <ListGroup.Item as="li" >
                {filteredData.map((item) => (
                  <Card
                    style={{ maxwidth: "50rem", height: "auto" }}
                    className="mt-5 cartcardstyle"
                  >
                    <div className="cardflex">
                      <div>
                        <Card.Img
                          variant="top"
                          src={item.prdId.image[0]}
                          style={{ width: "7rem", height: "10rem" }}
                          className="img-rounded ms-3"
                        />
                      </div>

                      <Card.Body>
                        <div className="cardhead">
                          
                        </div>
                        <div className="cardtext ">
                        <Container>
                        <Row>
                      
                          <Col >
                        <Card.Text style={{ fontFamily: "monospace" }} className='mt-5'>
                          
                          {item.prdId.prdName}
                          </Card.Text>
                          </Col>
                          <Col  >
                          <Card.Text style={{ fontFamily: "monospace" }}className='mt-5'>
                            
                            {item.prdId.size}
                          </Card.Text>
                          </Col>
                          <Col  >
                            <Card.Text style={{ fontFamily: "monospace" }} className='mt-5'>
                              
                              {item.prdId.prize}
                            </Card.Text>
                            </Col>
                            <Col  >
                            <Card.Text style={{ fontFamily: "monospace" }} className='mt-5'>
                              
                              {item.quantity}
                            </Card.Text>
                            </Col>
                          
                            <Col  >
                            <Card.Text style={{ fontFamily: "monospace" }} className='mt-5'>
                              {/* {item.prdId.prize * item.quantity} */}
                              
                              {item.quantity*item.prdId.prize}

                            </Card.Text>
                            </Col>
                            <Col  >
                            <Card.Text style={{ fontFamily: "monospace" }} >
                              {/* {item.prdId.prize * item.quantity} */}
                              Address
                           
                             

                              <br/>
                             Number:
                            </Card.Text>
                          </Col>
                          <Col  >
                            <Card.Text style={{ fontFamily: "monospace" }} className='mt-5'>
                              {/* {item.prdId.prize * item.quantity} */}
                              payment
                            </Card.Text>
                            </Col>
                            <Col  >
                            {
      <select  style={buttonStyle}  name="status" onChange={(e)=>statusChange(item._id,e.target.value)} className='mt-5'>
        <option >{item.status==3?("Order Cancelled"): item.status==4? ("Processing"): item.status==5? ("out for delivery"): ("Ordered")}
        </option>
        <option value="4" >Processing</option>
        <option value="5">Out For Delivery</option>
        {/* <option value="6">Out of Stock</option> */}
        {/* <option value="option3">Deliverd</option> */}

      </select>}
                          </Col>
                          
                          <Col  >
                          {/* {item.status===3?
                          <div>
                          <Button
                            variant="primary"
                            size="sm"
                            className="cartbtnstyle mt-5"
                            // onClick={()=>rejectOrder(item._id)}
                          >
                           cancelled
                          </Button>
                          </div>:
                          ""
                          } */}
                          </Col>

                        </Row>
                        </Container>
                        </div>
                        <div>
                          
                        </div>
                      </Card.Body>
                    </div>
                  </Card>
                  ))} 
                    </ListGroup.Item>
                 </ListGroup>
              </Col> 
            </Row>
          </Container>
          </>
}
        </div>

      </div>
    </div>
  )
}

export default Vieworders