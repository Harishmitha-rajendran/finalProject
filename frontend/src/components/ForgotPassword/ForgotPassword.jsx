import React, {useState} from 'react'
import '../Login/Login.css'
import '../../index.css'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const ForgotPassword = () => {

  const [loading,setLoading]=useState(false)
  const [email, setEmail] = useState('');

  const sendVerificationMail = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post('http://localhost:3000/sendVerificationMail', { email });
      toast.success('Verification mail sent successfully!');
    } catch (error) {
      setLoading(false)
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

{ !loading ?  ' Send Verification Mail'   :
            (  <Box sx={{ display: 'flex' }}>
                <CircularProgress  color='inherit' size={25}/>
               </Box> 
            )
}   
        </button>
           
        </form>
        <ToastContainer />
    </div>
  )
}
export default ForgotPassword;