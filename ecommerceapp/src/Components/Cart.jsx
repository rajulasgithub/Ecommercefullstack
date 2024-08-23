import React, { useEffect, useState } from "react";
import "./Style.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import axios from "axios";
import Form from "react-bootstrap/Form";
import {useNavigate} from 'react-router-dom'


const Cart = () => {
  const navigate=useNavigate();

  const [cartitem, setCartitem] = useState([]);
  // const[totalprize,setTotalprize]= useState(1);
  // const[cartcount,setCartcount]=useState(0);
  const [address, setAddress] = useState({
    address: "",
    state: "",
    district: "",
    pincode: "",
    BuildingNumber: "",
  });
  const[newaddress,setNewaddress]=useState({
    
  })
  // console.log(address.pincode);
  // console.log(address)
  const [value, setValue] = useState({});

const [totalValue,setTotalValue] = useState(0)


  useEffect(() => {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `bearer ${token}`,
      // 'Content-Type':'application/json'
    };
    axios
      .get("http://localhost:8080/product/viewcart", {
        headers: headers,
      })
      .then((response) => {
        let val=0;
        console.log(val);
        response.data.data?.map((item)=>{
          // console.log(item.prdId.prize)  
          val+= (item.prdId.prize*item.quantity); 
         })
        //  console.log(val)
        setTotalValue(val)
       
        setCartitem(response.data.data);
        
        
        // console.log(cartitem);
      })
      .catch((error) => {
        console.log(error);
      });
    
    

  }, []);

  const decrement = (id) => {
    console.log(id);
    axios
      .put(`http://localhost:8080/product/decrcart/${id}`)
      .then((response) => {
        console.log(response.data.data);
        const filter = cartitem.filter((data) => {
          if (data._id == id) {
            data.quantity -= 1;
          }
          return data;
        });
        setCartitem(filter);
      console.log(cartitem);
      
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const increment = (id) => {
    axios
      .put(`http://localhost:8080/product/incrcart/${id}`)
      .then((response) => {
        console.log(response);
        const filter = cartitem.filter((data) => {
          if (data._id == id) {
            data.quantity += 1;
          }
          return data;
        });
        setCartitem(filter);
        console.log(cartitem)
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handlehange = async (event) => {
    console.log(event.target.name);
    setAddress({ ...address, [event.target.name]: event.target.value });
  };
console.log(address);
  const handleAdd = async (event) => {
    console.log(event.target.name);
    setNewaddress({ ...newaddress, [event.target.name]: event.target.value });
  };
  console.log(newaddress);


  const handleSubmit = async (event) => {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `bearer ${token}`,
      // 'Content-Type':'application/json'
    };
    axios
      .post("http://localhost:8080/address/addAddress", newaddress, {
        headers: headers,
      })
      .then((response) => {
        console.log(response.data.data);
        // setValue(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

 useEffect(() => {
  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `bearer ${token}`,
    // 'Content-Type':'application/json'
  };

  axios
    .get("http://localhost:8080/address/getaddress", { headers: headers })
    .then((response) => {
      console.log(response.data.data);
      setAddress(response.data.data);
    })
    .catch((error) => {
      console.log(error);
    });
  console.log(address);
   
 }, [])
 

  const handleUpdate = async (event) => {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `bearer ${token}`,
      // 'Content-Type':'application/json'
    };
    axios
      .put("http://localhost:8080/address/updateaddress",address, { headers: headers })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const removeItem=(id)=>{
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `bearer ${token}`,
      // 'Content-Type':'application/json'
    };
    axios.get(`http://localhost:8080/product/delcartitem/${id}`,{headers:headers}).then((response)=>{
      console.log(response);
      
    }).catch((error)=>{
      console.log(error);
    })
  }

  const chekOut=()=>{
    navigate('/ordersummary');
  }

  return (
    <div>
      <div>
        <div className="cartinnerdiv ">
          <div className="carthead">
            <h4 style={{ fontFamily: "monospace" }} className="">
              Shopping Bag
            </h4>
            <h6 style={{ fontFamily: "monospace" }} className="">
              items in your bag
            </h6>
          </div>
          <Container>
            <Row>
              <Col sm={8} className="cartcolstyleone me-5">
                <div className="carttitlebartop">
                  <div className="carttitlebar">
                    <h6>Product</h6>
                  </div>
                  <div className="carttitlebar">
                    <h6 className="">Prize</h6>

                    <h6 className="">Quantity</h6>
                    <h6 className="">Total Prize</h6>
                  </div>
                </div>
                {cartitem.map((item) => (
                  <Card
                    style={{ maxwidth: "50rem", height: "10rem" }}
                    className="mt-5 cartcardstyle"
                  >
                    <div className="cardflex">
                      <div>
                        <Card.Img
                          variant="top"
                          src={item.prdId.image[0]}
                          style={{ width: "7rem", height: "10rem" }}
                          className="img-rounded"
                        />
                      </div>

                      <Card.Body>
                        <div className="cardhead">
                          <Card.Title style={{ fontFamily: "monospace" }}>
                            {item.prdId.prdName}
                          </Card.Title>
                          <Card.Text style={{ fontFamily: "monospace" }}>
                            Size:{item.prdId.size}
                          </Card.Text>
                        </div>

                        <div className="cardflexone">
                          <div>
                            <Card.Text style={{ fontFamily: "monospace" }}>
                              {item.prdId.prize}
                            </Card.Text>
                          </div>
                          <div className="counterflex">
                            {/* <div className='counterflex'> */}
                            <button
                              className="decrement"
                              onClick={() => decrement(item._id)}
                            >
                              -
                            </button>
                            <Card.Text style={{ fontFamily: "monospace" }}>
                              {item.quantity}
                            </Card.Text>
                            <button onClick={() => increment(item._id)}>
                              +
                            </button>
                            {/* </div> */}
                          </div>
                          <div>
                            <Card.Text style={{ fontFamily: "monospace" }}>
                              {item.prdId.prize * item.quantity}
                            </Card.Text>
                          </div>
                        </div>

                        <div>
                          
                          <Button
                            variant="success"
                            size="sm"
                            className="cartbtnstyle"
                            onClick={()=>removeItem(item._id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </Card.Body>
                    </div>
                  </Card>
                ))}
              </Col>

              <Col sm={3} className="cartcolstyle">
                <h5 className="text-center mt-3">Shipping Address</h5>
                {address.address&&address.state&&address.district&&address.pincode&&address.BuildingNumber?(
                
             <>
                <Form.Control
                  onChange={handlehange}
                  as="textarea"
                  className="carttxtare mt-3 "
                  name="address"
                  value={address?.address}
                  placeholder="Enter Address"
                  style={{
                    height: "30px",
                    backgroundColor: "#E6E6FA",
                    borderRadius: 25,
                  }}
                />
                <div className="formflex gap-3">
                  <Form.Control
                    onChange={handlehange}
                    type="input"
                    className="mt-3"
                    name="state"
                    value={address?.state}
                  
                    placeholder="State"
                    style={{
                      height: "30px",
                      backgroundColor: "#E6E6FA",
                      borderRadius: 25,
                    }}
                  />
                  <Form.Control
                    onChange={handlehange}
                    type="input"
                    className="mt-3"
                    name="district"
                  value={address?.district}

                    placeholder="District"
                    style={{
                      height: "30px",
                      backgroundColor: "#E6E6FA",
                      borderRadius: 25,
                    }}
                  />
                </div>
                <div className="formflex gap-2">
                  <Form.Control
                    onChange={handlehange}
                    type="input"
                    className="mt-3"
                    name="pincode"
                  value={address?.pincode}

                    placeholder="pincode"
                    style={{
                      height: "30px",
                      backgroundColor: "#E6E6FA",
                      borderRadius: 25,
                    }}
                  />
                  <Form.Control
                    onChange={handlehange}
                    type="input"
                    className="mt-3"
                    name="BuildingNumber"
                  value={address?.BuildingNumber}

                    placeholder="Building Number"
                    style={{
                      height: "30px",
                      backgroundColor: "#E6E6FA",
                      borderRadius: 25,
                    }}
                  />
                </div>
                <div className=" text-center d-grid mt-3 carttotalbtn">
                   <Button variant="dark" size="sm" onClick={handleUpdate}>
                      Update
                    </Button>
                  </div>
             </>
                ):(
                <>
                  <Form.Control
                  onChange={handleAdd}
                  as="textarea"
                  className="carttxtare mt-3 "
                  name="address"
                  placeholder="Enter Address"
                  style={{
                    height: "30px",
                    backgroundColor: "#E6E6FA",
                    borderRadius: 25,
                  }}
                />
                <div className="formflex gap-3">
                  <Form.Control
                    onChange={handleAdd}
                    type="input"
                    className="mt-3"
                    name="state"
                    placeholder="State"
                    style={{
                      height: "30px",
                      backgroundColor: "#E6E6FA",
                      borderRadius: 25,
                    }}
                  />
                  <Form.Control
                    onChange={handleAdd}
                    type="input"
                    className="mt-3"
                    name="district"
                    placeholder="District"
                    style={{
                      height: "30px",
                      backgroundColor: "#E6E6FA",
                      borderRadius: 25,
                    }}
                  />
                </div>
                <div className="formflex gap-2">
                  <Form.Control
                    onChange={handleAdd}
                    type="input"
                    className="mt-3"
                    name="pincode"
                    placeholder="pincode"
                    style={{
                      height: "30px",
                      backgroundColor: "#E6E6FA",
                      borderRadius: 25,
                    }}
                  />
                  <Form.Control
                    onChange={handleAdd}
                    type="input"
                    className="mt-3"
                    name="BuildingNumber"
                    placeholder="Building Number"
                    style={{
                      height: "30px",
                      backgroundColor: "#E6E6FA",
                      borderRadius: 25,
                    }}
                  />
                </div>
                <div className=" text-center d-grid mt-3 carttotalbtn">
                    
                    <Button variant="dark" size="sm" onClick={handleSubmit}>
                      Add
                    </Button>
                  </div>
                </>
                )

              }
                
                <hr className="mt-4"></hr>
                <div className="carttotalstyle">
                  <div className="carttotalinner">
                    <div>
                      <h4 className="mb-3">Cart total</h4>
                    </div>
                    <div>
                      <div className="carttotaldivflex">
                        <>
                          <h6>Cart Total</h6>
                        </>
                        <>
                        {totalValue}
                        </>
                      </div>
                      <div className="carttotaldivflex">
                        <>
                          <h6>Discount</h6>
                        </>
                        <>
                          <h6>0</h6>
                        </>
                      </div>
                      <div className="carttotaldivflex mb-3">
                        <>
                          <h6> total</h6>
                        </>
                        <>
                          <h6>{totalValue}</h6>
                        </>
                      </div>
                    </div>
                    <div className="d-grid">
                      <Button variant="light" size="sm" onClick={chekOut}>
                        Check Out
                      </Button>
                    </div>
                    
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        {/* <Container>
      <Row>
    

<Col>
{cartitem.map((item)=>(
   
   <Card  className=' '>
<Card.Img variant="top" src={item.prdId.image[0]} className='cartimg'/>
<Card.Body className=''>
<Card.Title className=''>{item.prdId.prdName}</Card.Title>
<Card.Text className=''>{item.prdId.material}</Card.Text>
<Card.Text className=''>{item.prdId.size}</Card.Text>
<Card.Text >{item.prdId.prize}</Card.Text>
<Card.Text >{item.quantity}</Card.Text>





<div className='text-center'>
<Button variant="primary" size="sm" >Buy Now</Button>
<Button variant="primary" size="sm" >Remove from Cart</Button>

</div>
</Card.Body>
</Card>


 ))} 
</Col>


        
       
      </Row>
      </Container> */}
      </div>
    </div>
  );
};

export default Cart;
