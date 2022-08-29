import React from 'react'
import { useState,useEffect } from 'react'
import "../index.css";




import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  Outlet,
  useParams,
  NavLink,
  useNavigate,
  useLocation
  
  
  } from 'react-router-dom';
  import {signInWithGooglePopup,signInWithMicrosoftPopup,createUserDocumentFromAuth, firebaseApp,auth} from '../utils/firebase/firebase.utils';

import Home  from './home';     
import Dashboard  from './dashboard'; 
import AcctHoldingRpt from './acctHoldingRpt';
import AcctTransactionRpt from './acctTransactionRpt';
import PageNotFound  from './pageNotFound'; 
import FixdIncmFndmntlsRpt from './fixdIncmFndmntlsRpt'


function Login() {
      return (
        <Router>      
           <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/dashboard' element={<Dashboard />}/>
              <Route path='/acctHoldingRpt' element={<AcctHoldingRpt />}/>
              <Route path='/acctTransactionRpt' element={<AcctTransactionRpt />}/>
              <Route path='/fixdIncmFndmntlsRpt' element={<FixdIncmFndmntlsRpt />}/>
              <Route path='*' element={<PageNotFound />}/>
              
              
            </Routes>    
        </Router>     
      );
  
   
  }

export default Login
