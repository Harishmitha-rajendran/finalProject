import React, {useState} from 'react'
import '../Login/Login.css'
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const sendVerificationMail = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:3000/sendVerificationMail', { email });
      setMessage('Verification mail sent successfully!');
    } catch (error) {
      setMessage('Failed to send verification mail. Please try again.');
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:3000/resetPassword', { email, newPassword });
      setMessage('Password reset successfully!');
    } catch (error) {
      setMessage('Failed to reset password. Please try again.');
    }
  };

  return (
    <div className='container'>
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

          <input 
          type="password" 
          className='inputBox' 
          value={newPassword} 
          onChange={(e) => setNewPassword(e.target.value)} 
          placeholder="Enter new password" required 
          />
          <input 
          type="password" 
          className='inputBox' 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          placeholder="Confirm password" required
           />
          <button 
          // onClick={(e)=>resetPassword(e)} 
          type='submit' 
          className='submitButton'>
          Reset Password
         </button>
           
        </form>
        {message && <p>{message}</p>}
    </div>
  )
}
export default ForgotPassword;