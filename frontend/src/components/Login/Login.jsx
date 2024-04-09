import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import '../../index.css'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import Loader from "react-js-loader";


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        password
      });
      
      if (response.data.success) {
        const userId= response.data.userId;

        // Store user data in localStorage
        localStorage.setItem("userId", JSON.stringify(userId));
        navigate('/HomePage')
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error("User not found");
      } else if (error.response && error.response.status === 401) {
        toast.error("Invalid password");
      } else {
        console.error("Error:", error);
      }
    }
  }
  

  return (
    <div className='container-bg container-fluid'>
      <form className='form'  onSubmit={(e) => login(e)}>
        <h1>Login</h1>
        <span className='inputBoxSpan d-flex justify-content-center align-items-center'>
        <FontAwesomeIcon className='ml-1' icon={faEnvelope} style={{ color: "#19105b" }} />
        <input
          value={email}
          placeholder="Email"
          onChange={(event) => setEmail(event.target.value)}
          className='inputBox mx-2'
          required
        />
        </span>
        <span className='inputBoxSpan md-flex justify-content-center align-items-center'>
        <FontAwesomeIcon className='ml-1' icon={faLock} style={{ color: "#19105b" }} />
        <input
          value={password}
          placeholder="Password"
          onChange={(event) => setPassword(event.target.value)}
          className='inputBox mx-2'
          required
        />
        </span>

        <div className='submitDiv d-flex justify-content-center align-items-center'>
        <button className='submitBtn' type="submit" >Login </button>
        <Loader type="spinner-default" bgColor='white' color='white' size={25} />
        </div>

        <span className='fp'  onClick={() => {navigate("/ForgotPassword")}}>Forgot Password ? </span>
        
      </form>
       <ToastContainer /> 
    </div>
  );
}

export default Login;
