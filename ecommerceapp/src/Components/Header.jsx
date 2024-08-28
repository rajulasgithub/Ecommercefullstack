import React from 'react'
import './Header.css'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
// import {useNavigate} from 'react-router-dom'


const Header = () => {
  // const navigate = useNavigate()

  const role=localStorage.getItem('role')
  const logout=()=>{
    localStorage.clear();
    // navigate('home')
  }
  return (
    <div>
        <Navbar collapseOnSelect expand="lg" className="navclr " >
      <Container >
        <Navbar.Brand href="#home">TrendLife</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {role==2?
            <>
            <Nav.Link href="/login" className='navtext'>Login</Nav.Link>
            <Nav.Link href="/cart" className='navtext'>View Cart</Nav.Link>
            <Nav.Link href="/viewproduct" className='navtext'>View product</Nav.Link>
            <Nav.Link href="/ordersummary" className='navtext'>Order Summary</Nav.Link>
            <Nav.Link href="/home" className='navtext' onClick={logout}>Logout</Nav.Link>

            {/* <Nav.Link href="/payment" className='navtext'>Payment</Nav.Link> */}


            </>:
             role==3?
             <>
            <Nav.Link href="/companysignup" className='navtext'>Login</Nav.Link>
            <Nav.Link href="/viewproduct" className='navtext'>View product</Nav.Link>
            <Nav.Link href="/addproduct" className='navtext'>Add product</Nav.Link>
            <Nav.Link href="/vieworders" className='navtext'>View Order</Nav.Link>
            <Nav.Link href="/home" className='navtext' onClick={logout}>Logout</Nav.Link>



             </>:
             <>
              <Nav.Link href="/home" className='navtext me-3'>Home</Nav.Link>
            <Nav.Link href="/login" className='navtext'>Login</Nav.Link>

              <Nav.Link href="/signup" className='navtext'>Signup</Nav.Link>
             </>
            

            }
            

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

        </div>
    
  )
}

export default Header