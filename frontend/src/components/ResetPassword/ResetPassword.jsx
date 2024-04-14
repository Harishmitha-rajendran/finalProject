import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../index.css'
import '../Login/Login.css'
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock } from '@fortawesome/free-solid-svg-icons';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const ResetPassword = () => {

  const [loading,setLoading]=useState(false)
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
//   const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const { email: emailParam } = useParams();

  useEffect(() => {
    // Set email from the URL parameter
    setEmail(emailParam);
  }, [emailParam]);

  const resetPassword = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      if (newPassword !== confirmPassword) {
        setLoading(true)
        toast.error('Passwords do not match');
        return;
      }
      await axios.post('http://localhost:3000/resetPassword', { email, newPassword });
      setLoading(false)
      toast.success('Password reset successfull !');
    } catch (error) {
        setLoading(false)
        toast.error('Failed to reset password. Please try again.');
    }
  };

  return (
    <div className='container-bg container-fluid'>
      <form className='form'>
      <h1>EduVerse</h1>
      <span className='inputBoxSpan md-flex justify-content-center align-items-center'>
        <FontAwesomeIcon className='ml-1' icon={faLock} style={{ color: "#19105b" }} />  
        <input 
          className='inputBox mx-2'
          type="password" 
          value={newPassword} 
          onChange={(e) => setNewPassword(e.target.value)} 
          placeholder="Enter new password" 
          required 
        />
      </span>
      <span className='inputBoxSpan md-flex justify-content-center align-items-center'>
        <FontAwesomeIcon className='ml-1' icon={faLock} style={{ color: "#19105b" }} />
        <input 
         className='inputBox mx-2'
          type="password" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          placeholder="Confirm password" 
          required 
        />
      </span>
        <button 
        className='submitDiv'
        onClick={(e) => resetPassword(e)}>

{ !loading ?  'Reset Password'   :
            (  <Box sx={{ display: 'flex' }}>
                <CircularProgress  color='inherit' size={25}/>
               </Box> 
            )
}   

        </button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default ResetPassword;
