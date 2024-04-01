import { useState } from 'react'
import reactLogo from './assets/react.svg'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import  Login  from './components/Login/Login';
import  ForgotPassword  from './components/ForgotPassword/ForgotPassword'
import  ResetPassword  from './components/ResetPassword/ResetPassword'
import  CreateUser  from './components/CreateUser/CreateUser'


function App() {

  return (
    <>
    
    <BrowserRouter>
     <Routes>
      <Route path="/" element={<Login />}/>
      {/* <Route path="/admin" element={<Admin />}/> */}
      <Route path="/ForgotPassword" element={<ForgotPassword />}/>
      <Route path="/ResetPassword/:email" element={<ResetPassword />} />
      <Route path="/CreateUser" element={<CreateUser />} />
    </Routes>
    </BrowserRouter>
        
    </>
  )
}

export default App
