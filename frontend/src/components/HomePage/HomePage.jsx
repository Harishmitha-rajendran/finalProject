import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios for making HTTP requests
import AddEvent from '../AddEvent/AddEvent';
import CreateUser from '../CreateUser/CreateUser';
import '../../index.css';
import './HomePage.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Events from '../Events/Events';
import Calender from '../Calender/Calender'
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const [showAddEvent, setShowAddEvent] = useState(false);
    const [showCreateUser, setShowCreateUser] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showCalender, setShowCalender] = useState(false); 
    const navigate = useNavigate();

    const showCalenderComponent = (val) => {
        setShowCalender(val);
    };
    
    useEffect(() => {
        // Fetch user ID from localStorage
        const userId = localStorage.getItem('userId');

        // Make an HTTP request to the backend to check if the user is an admin
        const checkAdminStatus = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/adminStatus/${userId}`);
                setIsAdmin(response.data.isAdmin);
            } catch (error) {
                console.error('Error checking admin status:', error);
            }
        };

        // Call the function to check admin status
        if (userId) {
            checkAdminStatus();
        }

    }, []);

    const toggleAddEvent = () => {
        setShowAddEvent(!showAddEvent);
    };

    const toggleCreateUser = () => {
        setShowCreateUser(!showCreateUser);
    };

    

    return (
        <div className='container-fluid'>
            {isAdmin ? (
                <Navbar expand="lg" className="nav px-3">
                    <Container fluid={true}>
                        <Navbar.Brand style={{color:'white'}} href="#home">ELP</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="m-auto">
                                <Nav.Link style={{color:'white'}} onClick={() => { showCalenderComponent(false) }}>Home</Nav.Link>
                                <Nav.Link style={{color:'white'}} onClick={toggleAddEvent}>Add Event</Nav.Link>
                                <Nav.Link style={{color:'white'}} onClick={toggleCreateUser}>Create User</Nav.Link>
                                <Nav.Link style={{color:'white'}} onClick={() => { showCalenderComponent(true) }}>Calender</Nav.Link>
                                <Nav.Link  style={{color:'white'}} onClick={() => { localStorage.removeItem('userId'); navigate('/') }}>Logout</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            ) : (
                <Navbar expand="lg" className="nav px-3">
                    <Container fluid={true}>
                        <Navbar.Brand style={{color:'white'}} href="#home">ELP</Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="m-auto">
                            <Nav.Link style={{color:'white'}} onClick={() => { showCalenderComponent(false) }}>Home</Nav.Link>
                            <Nav.Link style={{color:'white'}} onClick={() => { showCalenderComponent(true) }}>Calender</Nav.Link>
                            <Nav.Link style={{color:'white'}} onClick={() => { localStorage.removeItem('userId'); navigate('/') }}>Logout</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            )}

            {showAddEvent && <AddEvent handleClose={toggleAddEvent} />}
            {showCreateUser && <CreateUser handleClose={toggleCreateUser} />}
            {showCalender ? <Calender /> : <Events />}

            <ToastContainer />
        </div>
    );
}

export default HomePage;
