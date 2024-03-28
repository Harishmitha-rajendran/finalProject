import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const login = async(e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        password
      });
      // If login is successful, redirect to admin component
      if (response.status==200) {
        // Navigate to admin component (replace with your routing logic)
        console.log(response.data)
      } else {
        console.log("wasted");
      }

    } catch (error) {
      console.error("Error:", error);
    }

  }

  return (
    <div className='container'>
      
      <form className='form' method='POST' onSubmit={(e)=>login(e)}>
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
        <p onClick={() => {navigate("/ForgotPassword")}}>Forgot Password ? </p>
        <button className='submitButton' type="submit" >Login</button>
      </form>

    </div>
  )
}

export default Login