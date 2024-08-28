import React, { useEffect, useState } from 'react'
import './Style.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from "react-bootstrap/Card";
import axios from 'axios';
import Form from 'react-bootstrap/Form';






const Vieworders = () => {
 const[order,setOrder]=useState([]);
 const [status, setStatus] = useState('');
 const[address,setAddress]=useState({})
  // useEffect(() => {
    // const token=localStorage.getItem('token');
    // const headers = {
    //   Authorization: `bearer ${token}`,
      // 'Content-Type':'application/json'
    // };
   
  //   axios.get('http://localhost:8080/product/vieworder',{headers:headers}).then((response)=>{
  //     console.log(response.data.data);
  //     setOrder(response.data.data)

  //   }).catch((error)=>{
  //     console.log(error);
      
  //   })

  //   axios.get('http://localhost:8080/address/getaddress',{headers:headers}).then((response)=>{
  //     console.log(response.data.data);
  //    setAddress(response.data.data)
  //   }).catch((error)=>{
  //     console.log(error);
  //   })
  
    
  // }, [])
  
  // console.log(order);
  // console.log(address)

  // const statusUpdate=(event)=>{
  //   setStatus(event.target.value)
  // }

  // const deleteOrder=()=>{
  //   axios.put('').then((response)=>{
  //     console.log(response);
  //   }).catch((error)=>{
  //     console.log(error);
      
  //   })
  // }

  return (
    <div>
      <div>
      <div className="cartinnerdiv ">
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
                {/* {order.map((item) => ( */}
                  <Card
                    style={{ maxwidth: "50rem", height: "auto" }}
                    className="mt-5 cartcardstyle"
                  >
                    <div className="cardflex">
                      <div>
                        <Card.Img
                          variant="top"
                          // src={item.prdId.image[0]}
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
                          Item
                          {/* {item.prdId.prdName} */}
                          </Card.Text>
                          </Col>
                          <Col  >
                          <Card.Text style={{ fontFamily: "monospace" }}className='mt-5'>
                            Size
                            {/* {item.prdId.size} */}
                          </Card.Text>
                          </Col>
                          <Col  >
                            <Card.Text style={{ fontFamily: "monospace" }} className='mt-5'>
                              prize
                              {/* {item.prdId.prize} */}
                            </Card.Text>
                            </Col>
                            <Col  >
                            <Card.Text style={{ fontFamily: "monospace" }} className='mt-5'>
                              Qnty
                              {/* {item.quantity} */}
                            </Card.Text>
                            </Col>
                          
                            <Col  >
                            <Card.Text style={{ fontFamily: "monospace" }} className='mt-5'>
                              {/* {item.prdId.prize * item.quantity} */}
                              total
                              {/* {localStorage.getItem('total')} */}

                            </Card.Text>
                            </Col>
                            <Col  >
                            <Card.Text style={{ fontFamily: "monospace" }} >
                              {/* {item.prdId.prize * item.quantity} */}
                              Address
                              {/* {address.address}
                              <br/>
                              {address.district}
                              {address.state}
                              <br/>
                              {address.pincode}
                              {address.BuildingNumber} */}
                              <br/>
                              876564567
                              
                            </Card.Text>
                          </Col>
                          <Col  >
                            <Card.Text style={{ fontFamily: "monospace" }} className='mt-5'>
                              {/* {item.prdId.prize * item.quantity} */}
                              payment
                            </Card.Text>
                            </Col>
                            <Col  >
                            
      <select value={status}  className='mt-5'>
        <option value="" >Status</option>
        <option value="option1">Processing</option>
        <option value="option2">Out For Delivery</option>
        <option value="option3">Deliverd</option>
      </select>
                          </Col>
                          <Col  >
                          <Button
                            variant="primary"
                            size="sm"
                            className="cartbtnstyle mt-5"
                            // onChange={deleteOrder}
                          >
                            Delete
                          </Button>
                          </Col>
                       
                        </Row>
                        </Container>
                        </div>
                        <div>
                          
                        </div>
                      </Card.Body>
                    </div>
                  </Card>
                 {/* ))}  */}
              </Col> 
            </Row>
          </Container>
        </div>

      </div>
    </div>
  )
}

export default Vieworders