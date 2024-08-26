import React, { useState } from 'react'
import './Style.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";




const Vieworders = () => {
 

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
                {/* {cartitem.map((item) => ( */}
                  <Card
                    style={{ maxwidth: "50rem", height: "10rem" }}
                    className="mt-5 cartcardstyle"
                  >
                    <div className="cardflex">
                      <div>
                        <Card.Img
                          variant="top"
                          src=''
                          style={{ width: "7rem", height: "10rem" }}
                          className="img-rounded"
                        />
                      </div>

                      <Card.Body>
                        <div className="cardhead">
                          
                        </div>

                        <div className="cardflexoneviewodr">
                        <Card.Text style={{ fontFamily: "monospace" }}>
                          Item
                          </Card.Text>
                          <Card.Text style={{ fontFamily: "monospace" }}>
                            Size:{}
                          </Card.Text>
                          <div>
                            <Card.Text style={{ fontFamily: "monospace" }}>
                              prize
                            </Card.Text>
                          </div>
                          <div>
                            <Card.Text style={{ fontFamily: "monospace" }}>
                              Quantity
                            </Card.Text>
                          </div>
                          
                          <div>
                            <Card.Text style={{ fontFamily: "monospace" }}>
                              {/* {item.prdId.prize * item.quantity} */}
                              total 
                            </Card.Text>
                          </div>
                          <div>
                            <Card.Text style={{ fontFamily: "monospace" }}>
                              {/* {item.prdId.prize * item.quantity} */}
                              Address 
                            </Card.Text>
                          </div>
                          <div>
                            <Card.Text style={{ fontFamily: "monospace" }}>
                              {/* {item.prdId.prize * item.quantity} */}
                              paymentmode
                            </Card.Text>
                            </div>
                            <div>
                            <Card.Text style={{ fontFamily: "monospace" }}>
                              {/* {item.prdId.prize * item.quantity} */}
                              Status
                            </Card.Text>
                          </div>
                        </div>

                        <div>
                          <Button
                            variant="success"
                            size="sm"
                            className="cartbtnstyle"
                          >
                            Remove
                          </Button>
                        </div>
                      </Card.Body>
                    </div>
                  </Card>
                {/* ))} */}
              </Col> 
            </Row>
          </Container>
        </div>

      </div>
    </div>
  )
}

export default Vieworders