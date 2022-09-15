import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import SelectControl from './selectcontrol';

import Loading from './loading';
import Header  from './header';
import PortfolioHoldingGrid from './portfolioHoldingGrid';
// import "@progress/kendo-theme-material/dist/all.css";
import "@progress/kendo-theme-default/dist/all.css";
const PortfolioHoldingRpt = () => {
  debugger;
    const [PortfolioHoldingRptData, populatePortfolioHoldingRptData] = useState([]);
    const [PortfolioHoldingRptDatatab2, populatePortfolioHoldingRptDatatab2] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      
      const fetchData = async () => {
           setLoading(true);
          try {
              //let data = location.state;
  
              let asOfId = JSON.parse(localStorage.getItem('userId'));// data.Email;
             
              //setEmail(email);
              GetPortfolioHoldingData();
            
              //  console.log(data);
          } catch (error) {
              console.error(error.message);
          }
  
      }
      fetchData();
  }, [])
  const filterData = (filter) => {
    const dataAcct = data.slice();
    return filterBy(dataAcct, filter);
  };

  const filterChange = (event) => {
    setDataAcct(filterData(event.filter));
  };
  
  const GetPortfolioHoldingData = async () => {
    debugger;
    //setLoading(true);
  
     let token = JSON.parse(localStorage.getItem('token'));
     let AsOfId = JSON.parse(localStorage.getItem('userId'));
     //let startDate = "06/30/2021";
     //let AsOfId=1744;
     let PageId = 1;
     const postData = {AsOfId, PageId};
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
          
            //  console.log(response);
            const rowData = response.data;
            populatePortfolioHoldingRptData(rowData.ocPortFolioHoldingsMainOutPut);
            //populatePortfolioHoldingRptDatatab2(rowData.ocPortFolioHoldingsTradeTypeOutPut);
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
        
        <PortfolioHoldingGrid data={PortfolioHoldingRptData} />
         
         
      </div>
    )
  }
  
  export default PortfolioHoldingRpt