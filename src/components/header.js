import React from 'react'
import {useLocation, useNavigate} from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
//import MenuIcon from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import LogoPage from './logoPage';
//import Sidebar from './sidebar';
import { FaSignOutAlt, FaChalkboard, FaListAlt, FaRegChartBar,FaDonate,FaChartLine,FaDice, FaUserAlt, FaCogs } from 'react-icons/fa';

const Header = () => {
    const location = useLocation();
    const state = location.state;
    const navigate = useNavigate();
    const pages = [];
    const settings = ['Dashboard', 'AcctHoldingRpt','AcctTransactionRpt','PortfolioHolding','Logout'];
      
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
      };
    let jwtToken = JSON.parse(localStorage.getItem('token'));
    const postRptData = {jwtToken};
    
    const openDashBoardPage=()=>{  
      navigate("/dashboard");
    }
    const openAcctHoldingRpt=()=>{
      navigate("/acctHoldingRpt");
    }
    const openAcctTransactionRpt=()=>{
      navigate("/acctTransactionRpt");
    }
    const openFixdIncmFndmntlsRpt=()=>{
     
      navigate("/fixdIncmFndmntlsRpt");
    }
    const openPortfolioHoldingsRpt=()=>{
    
      navigate("/portfoliHoldingsRpt");
    }
    const openAccountProfilePage=()=>{
      navigate("/accountProfile");
    }
    const openFixdIncmMaturityLadderRpt=()=>{
     
      navigate("/fixdIncmMtrtyLadrRpt");
    }
    const openAccountSectBenchRpt=()=>{
     
      navigate("/AcctSectBenchRpt");
    }

    const openReportDesignerRpt=()=>{
      navigate("/ReportDesignerRpt");
    }
    const openAcctPerfRpt=()=>{
     
      navigate("/AcctPerfRpt");
    }
    const openFixedIncomePortfolioOverviewRpt=()=>{
     
      navigate("/fixedIncomePortfolioOverviewRpt");
    }
    const signOut=()=>{
 
        navigate("/");
       //firebaseApp.auth.signOut();
       
    }
  return (
    
    <div>
   {/* <Sidebar></Sidebar> */}
      <nav className="navbar navbar-expand-md navbar-light bg-white shadow-sm" aria-label="Fourth navbar example">
    <div className="container-fluid">
      <a className="" onClick={openDashBoardPage}><LogoPage /></a>
      
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarsExample04" aria-controls="navbarsExample04" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarsExample04">
        <ul className="navbar-nav ms-auto mb-2 mb-md-0 mx-2">
          
          <li className="nav-item dropdown dropdown-menu-end">
            <a className="nav-link dropdown-toggle" href="#" id="dropdown04" data-bs-toggle="dropdown" aria-expanded="false">Account</a>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdown04">
              <li><a className="dropdown-item" onClick={openAccountProfilePage}>Profile</a></li>
              <li><a className="dropdown-item" onClick={openAcctTransactionRpt}>Transaction</a></li>
              <li><a className="dropdown-item"onClick={openAcctHoldingRpt}>Holding</a></li>
              <li><a className="dropdown-item"onClick={openAccountSectBenchRpt}>Sectors Comparison</a></li>
              <li><a className="dropdown-item"onClick={openAcctPerfRpt}>Performance</a></li>
              <hr />  
            </ul>
          </li>

          <li className="nav-item dropdown dropdown-menu-end">
            <a className="nav-link dropdown-toggle" href="#" id="dropdown05" data-bs-toggle="dropdown" aria-expanded="false">Fixed Income</a>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdown05">
              <li><a className="dropdown-item" onClick={openFixedIncomePortfolioOverviewRpt}>Portfolio Overview</a></li>
              <hr />
              <li><a className="dropdown-item" onClick={openFixdIncmMaturityLadderRpt}>Maturity Ladder</a></li>
              <li><a className="dropdown-item" onClick={openFixdIncmFndmntlsRpt}>Fundementals</a></li>   
            </ul>
          </li>

          <li className='nav-item'><a className='nav-link' onClick={openPortfolioHoldingsRpt}>Portfolio Holdings</a></li>
          {/* <li className='nav-item'><a className='nav-link' onClick={openReportDesignerRpt}>Report Designer</a></li> */}
          </ul>

          <div className="nav-item dropdown dropdown-menu-end">
            <a className="btn btn-outline-primary btn-sm dropdown-toggle px-1" href="#" id="dropdown05" data-bs-toggle="dropdown" aria-expanded="false"><FaUserAlt className='mx-2'></FaUserAlt></a>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdown05">
              <li><a className="dropdown-item" href="#"><FaCogs className='mx-2'></FaCogs>Settings</a></li>
              
              <li><a className="dropdown-item" onClick={signOut}><FaSignOutAlt className='mx-2'></FaSignOutAlt>Logout</a></li>   
            </ul>
          </div>

        
        
      </div>
    </div>
  </nav>

  

    </div>
  )
}

export default Header