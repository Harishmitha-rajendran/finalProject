import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useState } from 'react';
import AddEvent from '../AddEvent/AddEvent';
import CreateUser from '../CreateUser/CreateUser'
import '../../index.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Events from '../Events/Events'

function Admin() {

    const [showAddEvent, setShowAddEvent] = useState(false);
    const [showCreateUser, setShowCreateUser] = useState(false);

  const toggleAddEvent = () => {
    setShowAddEvent(!showAddEvent);
  };

  const toggleCreateUser = () => {
    setShowCreateUser(!showCreateUser);
  };

  return (
    <div className='container-fluid '>
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container  fluid={true}>
        <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={toggleAddEvent}>Add Event</Nav.Link>
            <Nav.Link onClick={toggleCreateUser}>Create User</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

    <Events/>



    {showAddEvent && <AddEvent  handleClose={toggleAddEvent} />}
    {showCreateUser && <CreateUser handleClose={toggleCreateUser} />}
    
    <ToastContainer/>
    </div>
  );
}

export default Admin;