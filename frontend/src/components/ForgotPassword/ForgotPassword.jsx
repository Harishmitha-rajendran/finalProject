import React, {useState} from 'react'
import '../Login/Login.css'
import '../../index.css'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const sendVerificationMail = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:3000/sendVerificationMail', { email });
      toast.success('Verification mail sent successfully!');
    } catch (error) {
      toast.error('User not found');
    }
  };

  return (
    <div className='container-bg container-fluid '>
         <form className='form'>
         <input
          value={email}
          placeholder="Enter your email here"
          onChange={(event) => setEmail(event.target.value)}
          className='inputBox'
          required
        />
        <button 
        onClick={(e)=>sendVerificationMail(e)}>
        Send Verification Mail
        </button>
           
        </form>
        <ToastContainer />
    </div>
  )
}
export default ForgotPassword;