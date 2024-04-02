import { useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import  Login  from './components/Login/Login';
import  ForgotPassword  from './components/ForgotPassword/ForgotPassword'
import  ResetPassword  from './components/ResetPassword/ResetPassword'
import  CreateUser  from './components/CreateUser/CreateUser'
import AddEvent  from './components/AddEvent/AddEvent'
import Admin  from './components/Admin/Admin'
import 'bootstrap/dist/css/bootstrap.min.css';

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
      <Route path="/AddEvent" element={<AddEvent />} />
      <Route path="/Admin" element={<Admin />} />
    </Routes>
    </BrowserRouter>
        
    </>
  )
}

export default App
