import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import '../../index.css'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        toast.success(response.data.message);
        navigate('/HomePage')
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
        <input
          value={email}
          placeholder="Enter your email here"
          onChange={(event) => setEmail(event.target.value)}
          className='inputBox'
          required
        />
        <input
          value={password}
          placeholder="Enter your password here"
          onChange={(event) => setPassword(event.target.value)}
          className='inputBox'
          required
        />
        
        <button className='submitButton' type="submit" >Login</button>
        <button className='submitButton' type='button' onClick={() => {navigate("/ForgotPassword")}}>Forgot Password ? </button>
        
      </form>
      {/* <ToastContainer /> */}
    </div>
  );
}

export default Login;
