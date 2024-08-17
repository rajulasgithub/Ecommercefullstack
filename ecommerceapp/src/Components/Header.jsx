import React from 'react'
import './Header.css'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const Header = () => {
  return (
    <div>
        <Navbar collapseOnSelect expand="lg" className="navclr " >
      <Container >
        <Navbar.Brand href="#home">TrendLife</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/home" className='navtext me-3'>Home</Nav.Link>
            <Nav.Link href="/signup" className='navtext'>Signup</Nav.Link>
            <Nav.Link href="/login" className='navtext'>Login</Nav.Link>
            <Nav.Link href="/companysignup" className='navtext'>Company Register</Nav.Link>
            <Nav.Link href="/addproduct" className='navtext'>Add product</Nav.Link>
            <Nav.Link href="/viewproduct" className='navtext'>View product</Nav.Link>

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

        </div>
    
  )
}

export default Header