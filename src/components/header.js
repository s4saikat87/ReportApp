import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
import { FaSignOutAlt, FaGripHorizontal, FaUserAlt, FaCogs, FaFileInvoiceDollar } from 'react-icons/fa';

const Header = () => {
  const location = useLocation();
  const state = location.state;
  const navigate = useNavigate();
  const pages = [];
  const settings = ['Dashboard', 'AcctHoldingRpt', 'AcctTransactionRpt', 'PortfolioHolding', 'Logout'];

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
  const postRptData = { jwtToken };

  const openDashBoardPage = () => {
    navigate("/dashboard");
  }
  const openAcctHoldingRpt = () => {
    navigate("/acctHoldingRpt");
  }
  const openAcctTransactionRpt = () => {
    navigate("/acctTransactionRpt");
  }
  const openFixdIncmFndmntlsRpt = () => {

    navigate("/fixdIncmFndmntlsRpt");
  }
  const openPortfolioHoldingsRpt = () => {

    navigate("/portfoliHoldingsRpt");
  }
  const openAccountProfilePage = () => {
    navigate("/accountProfile");
  }
  const openFixdIncmMaturityLadderRpt = () => {

    navigate("/fixdIncmMtrtyLadrRpt");
  }
  const openAccountSectBenchRpt = () => {

    navigate("/AcctSectBenchRpt");
  }

  const openReportDesignerRpt = () => {
    navigate("/ReportDesignerRpt");
  }
  const openAcctPerfRpt = () => {

    navigate("/AcctPerfRpt");
  }
  const openFixedIncomePortfolioOverviewRpt = () => {

    navigate("/fixedIncomePortfolioOverviewRpt");
  }

  const openSectorReturnPerformanceRpt = () => {

    navigate("/sctrReturnPerfrmnceRpt");
  }

  const signOut = () => {
    
    navigate("/");
    let token = JSON.parse(localStorage.getItem('token'));
    const postData = {};
    const config = {
      headers: {
        'authorization': `Bearer ${token.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }

    };
    axios.post('/token/revoke',
    postData,
    config
    )
      .then((response) => {
      // debugger;
      // localStorage.setItem('token', '');
       //console.log(response);
      // navigate("/");
          
        // if (response.statusText === '') {
         


        // }


      })
      .catch((error) => {
        // debugger;
        console.log("my error is " + error);
      })

      let tokenNew={token:''};
      localStorage.setItem('token',JSON.stringify(tokenNew));
    //firebaseApp.auth.signOut();

  }
  return (

    <div className='sticky-top'>
      {/* <Sidebar></Sidebar> */}
      <nav className="navbar navbar-expand-md navbar-light bg-white shadow-sm" aria-label="Fourth navbar example">
        <div className="container-fluid">
          <a  onClick={openDashBoardPage}><LogoPage /></a>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarsExample04" aria-controls="navbarsExample04" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarsExample04">
            <ul className="navbar-nav ms-auto mb-md-0 mx-2 my-1">

              <li className="nav-item dropdown dropdown-menu-end">
                <a className="nav-link dropdown-toggle btn border text-start px-1" href="#" id="dropdown04" data-bs-toggle="dropdown" aria-expanded="false"><span className='active'><FaGripHorizontal></FaGripHorizontal> Account</span> </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdown04">
                  <li><a className="dropdown-item cursorp" onClick={openAccountProfilePage}>Profile</a></li>
                  <li><hr className="dropdown-divider"></hr></li>
                  <li><a className="dropdown-item cursorp" onClick={openAcctTransactionRpt}>Transactions & Holdings</a></li>
                  
                  <li><hr className="dropdown-divider"></hr></li>
                  <li><a className="dropdown-item cursorp" onClick={openAccountSectBenchRpt}>Sectors Comparison</a></li>
                  <li><a className="dropdown-item cursorp" onClick={openAcctPerfRpt}>Performance</a></li>
                  <li><hr className="dropdown-divider"></hr></li>
                  <li><a className="dropdown-item cursorp" onClick={openPortfolioHoldingsRpt}>Portfolio Holdings</a></li>

                </ul>
              </li>

              <li className="nav-item dropdown dropdown-menu-end">
                <a className="nav-link dropdown-toggle btn border text-start px-1" href="#" id="dropdown05" data-bs-toggle="dropdown" aria-expanded="false"><span className='active'><FaFileInvoiceDollar></FaFileInvoiceDollar>Fixed Income</span></a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdown05">
                  
                  <li><a className="dropdown-item cursorp" onClick={openFixdIncmMaturityLadderRpt}>Maturity Ladder</a></li>
                  <li><a className="dropdown-item cursorp" onClick={openFixdIncmFndmntlsRpt}>Fundementals</a></li>
                </ul>
              </li>
              <li className="nav-item dropdown dropdown-menu-end">
                <a className="nav-link dropdown-toggle btn border text-start px-1" href="#" id="dropdown05" data-bs-toggle="dropdown" aria-expanded="false"><span className='active'><FaFileInvoiceDollar></FaFileInvoiceDollar>Performance</span></a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdown05">                  
                  <li><a className="dropdown-item cursorp" onClick={openSectorReturnPerformanceRpt}>Sector Return</a></li>
                </ul>
              </li>


              <li className="nav-item dropdown dropdown-menu-end">
                <a className="nav-link dropdown-toggle btn px-2 border text-start px-1" href="#" id="dropdown07" data-bs-toggle="dropdown" aria-expanded="false"><span className='active'><FaUserAlt className='mx-2'></FaUserAlt></span></a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdown07">
               
                  <li><a className="dropdown-item cursorp" href="#" ><span><FaCogs></FaCogs>Settings</span></a></li>
                  <li><a className="dropdown-item" onClick={signOut}><FaSignOutAlt></FaSignOutAlt>Logout</a></li>
                </ul>
              </li>

             
              
            </ul>

            



          </div>
        </div>
      </nav>



    </div>
  )
}

export default Header