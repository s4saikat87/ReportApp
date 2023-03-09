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
import AccountProfile from './accountProfile';
import PortfolioHoldingsRpt from './portfoliHoldingsRpt';
import FixdIncmMaturityLadrRpt from './fixdIncmMtrtyLadrRpt';
import AcctSectBenchRpt from './AcctSectBenchRpt';
import AcctPerfRpt from './AcctPerfRpt';
import FixedIncomePortfolioOverviewRpt from './fixedIncomePortfolioOverviewRpt';
import SctrReturnPerformanceRpt from './sctrReturnPerfrmnceRpt';

function Login() {
      return (
        <Router>      
           <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/dashboard' element={<Dashboard />}/>
              <Route path='/acctHoldingRpt' element={<AcctHoldingRpt />}/>
              <Route path='/acctTransactionRpt' element={<AcctTransactionRpt />}/>
              <Route path='/fixdIncmFndmntlsRpt' element={<FixdIncmFndmntlsRpt />}/>
              <Route path='/accountProfile' element={<AccountProfile />}/>
              <Route path='/portfoliHoldingsRpt' element={<PortfolioHoldingsRpt />}/>
              <Route path='/fixdIncmMtrtyLadrRpt' element={<FixdIncmMaturityLadrRpt />}/>
              <Route path='/AcctSectBenchRpt' element={<AcctSectBenchRpt />}/>
              <Route path='/AcctPerfRpt' element={<AcctPerfRpt />}/>
              <Route path='/fixedIncomePortfolioOverviewRpt' element={<FixedIncomePortfolioOverviewRpt />}/> 
              <Route path='/sctrReturnPerfrmnceRpt' element={<SctrReturnPerformanceRpt/>}/> 
              <Route path='*' element={<PageNotFound />}/>
              
              
            </Routes>    
        </Router>     
      );
  
   
  }

export default Login
