import React, { useEffect, useState } from "react";
import "./Style.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Header from "./Header";
import ListGroup from "react-bootstrap/ListGroup";
import Modal from 'react-bootstrap/Modal';


const Vieworders = () => {
  const role = localStorage.getItem("role");
  const adrs = localStorage.getItem("address");

  const [order, setOrder] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterstatus, setFilterstatus] = useState([]);
  const [status, setStatus] = useState("");
  const [address, setAddress] = useState({});
  const [isDisabled, setIsDisabled] = useState(false);
  const [show, setShow] = useState(false);
  const [deliveryDate,setDeliveryDate]=useState("");
  const [getid,setGetId]=useState({})

  useEffect(() => {
    const token = localStorage.getItem("token");
    const ordertime = localStorage.getItem("orderedtime");
    if (ordertime) {
      const now = Date.now();      
      const hoursPassed = (now -ordertime);

      if (hoursPassed >86400000) {
        setIsDisabled(true); 
        localStorage.removeItem("buttonClickedTime"); 
      } else {
        setIsDisabled(false);
      }
    }

    console.log(token);
    const headers = {
      Authorization: `bearer ${token}`,
      // 'Content-Type':'application/json'
    };

    axios
      .get("http://localhost:8080/product/viewcartcmpny")
      .then((response) => {
        console.log(response.data.data);
        setOrder(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get("http://localhost:8080/product/vieworderuser", { headers: headers })
      .then((response) => {
        console.log(response.data.data);
        setOrder(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // const currdate = new Date();
  

  useEffect(() => {
    const filtered = order.filter(
      (item) =>
        item.status === 2 ||
        item.status === 3 ||
        item.status === 4 ||
        item.status === 5 ||
        item.status === 6 ||
        item.status === 7
    );
    setFilteredData(filtered);
  }, [order]);
  console.log(filteredData);

  const cancelOrder = (id) => {
    
    axios
      .put(`http://localhost:8080/product/cancelorder/${id}`)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
    window.location.reload();
  };

  

  const statusChange = (id, value) => {
    axios
      .put(`http://localhost:8080/product/updatecartstatus/${id}/${value}`)
      .then((response) => {
        console.log(response);
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  console.log(status);

  const buttonStyle = {
    backgroundColor: "green", 
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };

  const handleShow = (id) =>{
     setShow(true);
     setGetId(id)
  }
  const handleClose = () => setShow(false);


  const dateChange=(e)=>{
    const id=getid;
    console.log(deliveryDate);
   
     axios.put(`http://localhost:8080/product/updatedeliverydate/${id}`,deliveryDate).then((response)=>{
      console.log(response);
     }).catch((error)=>{
      console.log(error);
      
     })
     window.location.reload();
  }
  
  return (
    <div>
      <Header />
      <div>
        <div className="cartinnerdiv ">
          {role == 2 ? (
            <>
              <div className="carthead">
                <h4 style={{ fontFamily: "monospace" }} className="">
                  Order history
                </h4>
                <h6 style={{ fontFamily: "monospace" }} className="">
                  {filteredData.length} No Of Orders
                </h6>
              </div>

              <Container>
                <div className="orderbtns">
                  <Row>
                    <Col sm={11} className="cartcolstyleone ">
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

                      {filteredData.map((item, index) => (
                    
                        <Card
                          style={{ maxwidth: "50rem", height: "auto" }}
                          className="mt-5 cartcardstyle"
                        >
                          <div className="cardflex ms-2">
                            <div>
                              {index + 1}
                              <Card.Img
                                variant="top"
                                src={item.prdId?.image[0]}
                                style={{
                                  width: "15rem",
                                  height: "15rem",
                                  paddingTop: "1rem",
                                }}
                                className="img-rounded ms-3"
                              />

                              <Card.Text
                                style={{
                                  fontFamily: "monospace",
                                  marginLeft: "1rem",
                                }}
                                className="text-center"
                              >
                                {item.prdId?.prdName}
                              </Card.Text>
                            </div>
                            {item.status !== 6 ? (
                              <Card.Body>
                                <div className="cardhead"></div>
                                <div className="cardtext  ">
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
                                  <Card.Text
                                    style={{ fontFamily: "monospace" }}
                                    className=""
                                  >
                                    prize:
                                    {" " + item.prdId?.prize}
                                  </Card.Text>
                                  {/* </Col> */}
                                  {/* <Col  > */}
                                  <Card.Text
                                    style={{ fontFamily: "monospace" }}
                                    className=""
                                  >
                                    Qnty:
                                    {" " + item.quantity}
                                  </Card.Text>
                                  {/* </Col>
                          
                            <Col  > */}
                                  <Card.Text
                                    style={{ fontFamily: "monospace" }}
                                    className=""
                                  >
                                    {/* {item.prdId.prize * item.quantity} */}
                                    total :
                                    {" " + item.quantity * item.prdId?.prize}
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
                                  <Card.Text
                                    style={{ fontFamily: "monospace" }}
                                    className=""
                                  >
                                    {/* {item.prdId.prize * item.quantity} */}
                                    payment:{" "}
                                  </Card.Text>
                                  <Card.Text
                                    style={{ fontFamily: "monospace" }}
                                    className=""
                                  >
                                    {/* {item.prdId.prize * item.quantity} */}
                                    Order Date:{" "+item.date}
                                  </Card.Text>
                                  <Card.Text
                                    style={{ fontFamily: "monospace" }}
                                    className=""
                                  >
                                    {/* {item.prdId.prize * item.quantity} */}
                                    Delivery Date:{" "+item.deliveryDate}
                                  </Card.Text>
                                  {/* </Col>
                            <Col  > */}

                                  <Card.Text
                                    style={{ fontFamily: "monospace" }}
                                    className=""
                                  >
                                    status:{" "}
                                    {item.status === 3
                                      ? "Order Cancelled"
                                      : item.status === 4
                                      ? "Processing"
                                      : item.status === 5
                                      ? "out for delivery"
                                      : item.status === 6
                                      ? "out of stock"
                                      : item.status === 7
                                      ? "Delivered"
                                      : "Ordered"}
                                  </Card.Text>
                                </div>
                              </Card.Body>
                            ) : (
                              <div className="">
                              <Button
                                variant="danger"
                                size="lg"
                                className="outofstockbtn  ms-5" disabled
                              >
                                Out of stock
                              </Button>
                              </div>
                            )}
                          </div>
                          {(item.status === 3) ? (
                      
                            <div>
                              
                                <Button
                                  variant="primary"
                                  size="sm"
                                  className="viewprdbtnstyle  mb-4 ms-4"
                                  onClick={() => cancelOrder(item._id)}  disabled
                                >
                                  Cancelled
                                </Button>
                              
                            </div>
                          ) : (item.status===4)?
                          (
                          

                            <div>
                              <Button
                                  variant="primary"
                                  size="sm"
                                  className="viewprdbtnstyle ms-5 mb-3" disabled
                                
                                >
                                  Processing
                                </Button>
                                <Button
                            variant="primary"
                            size="sm"
                            className="viewprdbtnstyle  ms-3 mb-3" 
                           
                          >
                            Track your Order
                          </Button>
                          
                            </div>
                          ):
                          (item.status===5)?
                          (
                            <div className="d-flex flex-column">
                               <Button
                                  variant="primary"
                                  size="sm"
                                  className="viewprdbtnstyle ms-4 mb-2" disabled
                                
                                >
                                  Out for Delivery
                                </Button>
                                
                                <Button 
                            variant="primary"
                            size="sm"
                            className="viewprdbtnstyle  ms-4 mb-2"
                           
                          >
                            Track your Order
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            className="viewprdbtnstyle ms-4 mb-2" disabled={isDisabled} onClick={()=>handleShow(item._id)}
                           
                          >
                            Change Delivery date
                          </Button>
                            </div>
                          ):
                          (item.status===6)?
                          (
                            <div>
                              <Button
                                  variant="primary"
                                  size="sm"
                                  className="viewprdbtnstyle  mb-4 ms-4" disabled
                                
                                >
                                  Out of stock
                                </Button>
                            </div>
                          ):
                          (item.status===7)?
                          (
                            <div>
                              <Button
                                  variant="primary"
                                  size="sm"
                                  className="viewprdbtnstyle  mb-4 ms-4" disabled
                                
                                >
                                  Delivered
                                </Button>
                            </div>
                          ):(item.status==2)?
                          (
                            <div className="d-flex flex-column">
                              <Button
                                variant="primary"
                                size="sm"
                                className="viewprdbtnstyle ms-4 mb-2"
                                onClick={() => cancelOrder(item._id)} disabled={isDisabled}
                              >
                                Cancel Order
                              </Button>
                              <Button
                            variant="primary"
                            size="sm"
                            className="viewprdbtnstyle ms-4 mb-2"
                           
                          >
                            Track your Order
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            className="viewprdbtnstyle ms-4 mb-2" disabled={isDisabled} onClick={()=>handleShow(item._id)}
                           
                          >
                            Change Delivery date
                          </Button>
                            </div>
                            
                          ):
                          <>
                          </>
                        }
                        </Card>
                      ))}
                    </Col>
                  </Row>
                  <div>
                    <div>
                      {/* <Button
                        variant="primary"
                        size="lg"
                        className="viewprdbtnstyle mb-3"
                      >
                        Track your Order
                      </Button> */}
                    </div>
                     
                    <div>
                      {/* <Button
                        variant="primary"
                        size="lg"
                        className="viewprdbtnstyle " 
                        onClick={handleShow}   disabled={isDisabled} 

                      >
                        Change Delivery date
                      </Button> */}
                    </div>


                    <div>
                    <Modal show={show} onHide={handleClose}>
                 <Modal.Header closeButton>
               <Modal.Title>Choose Date</Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <input
        type="date" name="deliveryDate"
        onChange={(e)=>setDeliveryDate({date:e.target.value})}
        // value={}
        // onChange={(e) => setDeliveryDate(e.target.value)}
      />
              </Modal.Body>
              <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
               Close
              </Button>
              <Button variant="primary" onClick={dateChange}>
               Save Changes
              </Button>
            </Modal.Footer>
             </Modal>

                    </div>


                  </div>
                </div>
              </Container>
              {/* nb */}
              <Container>
             <div className='viewodrres'>
              nbjk
            <Row >
              <Col sm={10} className="cartcolstyleone me-5">
               
               
                {filteredData.map((item,index) => (
                  <Card
                    style={{ maxwidth: "50rem", height: "auto" }}
                    className="mt-5 cartcardstyle"
                  >
                    
                    <div className="cardflex">
                      <div>
                      {index+1}
                        <Card.Img
                          variant="top" 
                          src={item.prdId?.image[0]}
                          style={{ width: "15rem", height: "15rem",paddingTop:'1rem' }}
                          className="img-rounded ms-3"
                        />

                         <Card.Text style={{ fontFamily: "monospace",marginLeft:'1rem' }} className='text-center'>
                          
                         {item.prdId?.prdName}
                          </Card.Text>
                      </div>
                      {item.status!=6? (
                      <Card.Body>
                        <div className="cardhead">
                          
                        </div>
                        <div className="cardtext  ">
                                                    <Card.Text style={{ fontFamily: "monospace" }} className=''>
                              prize:
                              {" "+item.prdId?.prize}
                            </Card.Text>
                           
                            <Card.Text style={{ fontFamily: "monospace" }} className=''>
                              Qnty:
                              {" "+item.quantity}
                            </Card.Text>
                           
                            <Card.Text style={{ fontFamily: "monospace" }} className=''>
                              total
                             {" "+item.quantity*item.prdId?.prize}
                            </Card.Text>
                           
                            <Card.Text style={{ fontFamily: "monospace" }} className=''>
                              payment
                            </Card.Text>
                            <Card.Text style={{ fontFamily: "monospace" }} className=''>
                              Order Date:
                            </Card.Text>
                            <Card.Text style={{ fontFamily: "monospace" }} className=''>
                               Delivery Date:
                            </Card.Text>
                            

                           <Card.Text style={{ fontFamily: "monospace" }} className=''>
                            status: { item.status==3?("Order Cancelled"): item.status==4? ("Processing"): item.status==5? ("out for delivery"): item.status==6? ("out of stock"): ("Ordered")}
                            </Card.Text>
                            
      </div>
                        
                      </Card.Body>):
                      (
                        <Button
                        variant="danger"
                        size="lg"
                        className="cartbtnstyle "
                       
                      >
                       Out of stock
                      </Button> 
                    
                  )}
                  </div>
                    {item.status===3?
                    <div>
                    <Button
                      variant="primary"
                      size="lg"
                      className="viewprdbtnstyle  mb-4 ms-2"
                     onClick={()=>cancelOrder(item._id)}
                    >
                     Cancelled
                    </Button>
              </div>:
                          <div>
                          <Button
                            variant="primary"
                            size="lg"
                            className="viewprdbtnstyle mb-4 ms-2"
                           onClick={()=>cancelOrder(item._id)}
                          >
                           Cancel Order
                          </Button>
                          <Button
                            variant="primary"
                            size="lg"
                            className="viewprdbtnstyle mb-3"
                           
                          >
                            Track your Order
                          </Button>
                          <Button
                            variant="primary"
                            size="lg"
                            className="viewprdbtnstyle " disabled={isDisabled}
                           
                          >
                            Change Delivery date
                          </Button>

                    </div>
}
                  </Card>
                 ))}  
              </Col> 
            </Row>
            {/* <div>
              
                          <div>
                          <Button
                            variant="primary"
                            size="lg"
                            className="viewprdbtnstyle mb-3"
                           
                          >
                            Track your Order
                          </Button>
                          </div>
                          <div>
                          <Button
                            variant="primary"
                            size="lg"
                            className="viewprdbtnstyle "
                           
                          >
                            Change Delivery date
                          </Button>
                          </div>
          
          </div> */}
          </div>
          </Container>
              {/* mn */}
            </>
          ) : (
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
                      <ListGroup.Item as="li">
                        {filteredData.map((item) => (
                          <Card
                            style={{ maxwidth: "50rem", height: "auto" }}
                            className="mt-5 cartcardstyle"
                          >
                            <div className="cardflex">
                              <div>
                                <Card.Img
                                  variant="top"
                                  src={item.prdId?.image[0]}
                                  style={{ width: "7rem", height: "10rem" }}
                                  className="img-rounded ms-3"
                                />
                              </div>

                              <Card.Body>
                                <div className="cardhead"></div>
                                <div className="cardtext ">
                                  <Container>
                                    <Row>
                                      <Col>
                                        <Card.Text
                                          style={{ fontFamily: "monospace" }}
                                          className="mt-5"
                                        >
                                          {item.prdId?.prdName}
                                        </Card.Text>
                                      </Col>
                                      <Col>
                                        <Card.Text
                                          style={{ fontFamily: "monospace" }}
                                          className="mt-5"
                                        >
                                          {item.prdId?.size}
                                        </Card.Text>
                                      </Col>
                                      <Col>
                                        <Card.Text
                                          style={{ fontFamily: "monospace" }}
                                          className="mt-5"
                                        >
                                          {item.prdId?.prize}
                                        </Card.Text>
                                      </Col>
                                      <Col>
                                        <Card.Text
                                          style={{ fontFamily: "monospace" }}
                                          className="mt-5"
                                        >
                                          {item.quantity}
                                        </Card.Text>
                                      </Col>

                                      <Col>
                                        <Card.Text
                                          style={{ fontFamily: "monospace" }}
                                          className="mt-5"
                                        >
                                          {/* {item.prdId.prize * item.quantity} */}

                                          {item.quantity * item.prdId?.prize}
                                        </Card.Text>
                                      </Col>
                                      <Col>
                                        <Card.Text
                                          style={{ fontFamily: "monospace" }}
                                        >
                                          {/* {item.prdId.prize * item.quantity} */}
                                          Address
                                          <br />
                                          Number:
                                        </Card.Text>
                                      </Col>
                                      <Col>
                                        <Card.Text
                                          style={{ fontFamily: "monospace" }}
                                          className="mt-5"
                                        >
                                          {/* {item.prdId.prize * item.quantity} */}
                                          payment
                                        </Card.Text>
                                      </Col>
                                      <Col>
                                        {
                                          <select
                                            style={buttonStyle}
                                            name="status"
                                            onChange={(e) =>
                                              statusChange(
                                                item._id,
                                                e.target.value
                                              )
                                            }
                                            className="mt-5"
                                          >
                                           
                                             
                                            <option>
                                              {item.status === 3
                                                ? "Order Cancelled"
                                                : item.status === 4
                                                ? "Processing"
                                                : item.status === 5
                                                ? "out for delivery"
                                                : item.status === 6
                                                ? "out of stock"
                                                : item.status === 7
                                                ? "Delivered"
                                                : "Ordered"}
                                            </option>
                                            {( item.status==3 )?(
                                            <>
                                            <Button variant="secondary">
                                            Cancelled
                                           </Button>
    
                                            </>):(item.status==6)?
                                            (
                                              <>
                                              <Button variant="secondary">
                                            Out of Stock
                                           </Button>
                                              </>
                                            ):
                        
                                            <>
                                            <option value="4">
                                              Processing
                                            </option>
                                            <option value="5">
                                              Out For Delivery
                                            </option>
                                            <option value="7">Delivered</option>
                                            </>

                                              }
                                            
                                          </select>
                                        }
                                      </Col>

                                      <Col>
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
                                <div></div>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Vieworders;
