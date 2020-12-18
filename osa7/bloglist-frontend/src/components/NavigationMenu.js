import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'

const NavigationMenu = ({ handleLogout }) => {
  const user = useSelector(state => state.user)

  return (
    <Navbar bg="light" className="mb-2">
      <Navbar.Brand>Blog App</Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link as={Link} to="/">Blogs</Nav.Link>
        <Nav.Link as={Link} to="/users">Users</Nav.Link>
      </Nav>
      <Nav>
        <Navbar.Text>{user.name} logged in&nbsp;&nbsp;</Navbar.Text>
        <Button variant="outline-success" onClick={handleLogout}>Logout</Button>
      </Nav>
    </Navbar>
  )
}

export default NavigationMenu