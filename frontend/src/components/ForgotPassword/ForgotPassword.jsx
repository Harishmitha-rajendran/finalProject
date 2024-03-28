import React, {useState} from 'react'
import '../Login/Login.css'

const ForgotPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setconfirmPassword] = useState('');

    const change = (e) =>{

    }

  return (
    <div className='container'>
         <form onSubmit={(e)=>change(e)} className='form'>
          <input type="password" className='inputBox' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} 
          placeholder="Enter new password" required />
          <input type="password" className='inputBox' value={confirmPassword} onChange={(e) => setconfirmPassword(e.target.value)} 
          placeholder="Confirm password" required />
          <button  type='submit' className='submitButton'>Reset</button>
        </form>
    </div>
  )
}
export default ForgotPassword;