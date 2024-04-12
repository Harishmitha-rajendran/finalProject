import React, {useState} from 'react'
import '../Login/Login.css'
import '../../index.css'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

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
         <h1>EduVerse</h1>
         <span className='inputBoxSpan md-flex justify-content-center align-items-center'>
         <FontAwesomeIcon className='ml-1' icon={faEnvelope} style={{ color: "#19105b" }} />
         <input
         type='email'
          value={email}
          placeholder="Email"
          onChange={(event) => setEmail(event.target.value)}
          className='inputBox mx-2'
          required
        />
        </span>
        <button className='submitDiv'
        onClick={(e)=>sendVerificationMail(e)}>
        Send Verification Mail
        </button>
           
        </form>
        <ToastContainer />
    </div>
  )
}
export default ForgotPassword;