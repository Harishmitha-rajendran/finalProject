import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom';
import '../../index.css'
import AddEvent from '../AddEvent/AddEvent';
import CreateUser from '../CreateUser/CreateUser'

const Navbars = ({toggleAddEvent, toggleCreateUser}) => {
  const navigate = useNavigate();

  const handleAddEventClick = () => {
    toggleAddEvent(); // Trigger the function to show/hide AddEvent component
  };

  const handleCreateUserClick = () => {
    toggleCreateUser(); // Trigger the function to show/hide CreateUser component
  };

  return (
    <div className='container-fluid'>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid={true}>
          <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={() => navigate('/Admin')}>Home</Nav.Link>
              <Nav.Link onClick={handleAddEventClick}>Add Event</Nav.Link>
              <Nav.Link onClick={handleCreateUserClick}>Create User</Nav.Link>
              <Nav.Link onClick={() => navigate('/Calender')}>Calendar</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

     
      {showAddEvent && <AddEvent handleClose={toggleAddEvent} />}
      {showCreateUser && <CreateUser handleClose={toggleCreateUser} />}
    </div>
  );
};

export default Navbars;
