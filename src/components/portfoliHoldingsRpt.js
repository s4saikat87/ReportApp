import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import SelectControl from './selectcontrol';

import Loading from './loading';
import Header  from './header';
import PortfolioHoldingsGrid from './portfolioHoldingsGrid';

import Enumerable from 'linq';
const PortfolioHoldingsRpt = () => {
  
    const [PortfolioHoldingsRptData, populatePortfolioHoldingsRptData] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      
      const fetchData = async () => {
           setLoading(true);
          try {
              //let data = location.state;
  
              let userId = JSON.parse(localStorage.getItem('userId'));// data.Email;
             
              //setEmail(email);
              GetPortFolioHoldingsData();
            
              //  console.log(data);
          } catch (error) {
              console.error(error.message);
          }
  
      }
      fetchData();
  }, [])
  
  
  const GetPortFolioHoldingsData = async () => {
    setLoading(true);
  debugger;
     let token = JSON.parse(localStorage.getItem('token'));
     let AsOfId = JSON.parse(localStorage.getItem('userId'));
     let pageId = 1;
     const postData = {AsOfId, pageId};
     const config = {
        headers: {
          'authorization': `Bearer ${token.token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      
  };
    await axios.post('/PortfolioHoldings',
        postData,
       config
    )
        .then(response => {
          debugger;
            //  console.log(response);
  
            //const rowData = response.data;

            const rowData = Enumerable.from(response.data.ocPortFolioHoldingsMainOutPut).where(w => w.totMarket !== 0)
            .toArray();


            populatePortfolioHoldingsRptData(rowData)
            setLoading(false);
  
        })
        .catch((error) => {
  
            return error;
        });
  
  }
  
  
  
  
  
  if (loading) {
    return <Loading />
  }
  
    return (
      <div>
        <Header></Header>
  
         
         <PortfolioHoldingsGrid data={PortfolioHoldingsRptData} />
         
         
      </div>
    )
  }
  
  export default PortfolioHoldingsRpt