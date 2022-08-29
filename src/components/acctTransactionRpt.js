import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import SelectControl from './selectcontrol';

import Loading from './loading';
import Header  from './header';
import AcctTransactionGrid from './acctTransactionGrid';
// import "@progress/kendo-theme-material/dist/all.css";
import "@progress/kendo-theme-default/dist/all.css";
const AcctTransactionRpt = () => {
  
    const [AcctTransactionRptData, populateAcctTransactionRptData] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      
      const fetchData = async () => {
           setLoading(true);
          try {
              //let data = location.state;
  
              let userId = JSON.parse(localStorage.getItem('userId'));// data.Email;
             
              //setEmail(email);
              GetAcctTransactionData();
            
              //  console.log(data);
          } catch (error) {
              console.error(error.message);
          }
  
      }
      fetchData();
  }, [])
  
  
  const GetAcctTransactionData = async () => {
    debugger;
    setLoading(true);
  
     let token = JSON.parse(localStorage.getItem('token'));
     let userId = JSON.parse(localStorage.getItem('userId'));
     let startDate = "06/30/2021";
     let pageId = 1;
     const postData = {userId, startDate, pageId};
     const config = {
        headers: {
          'authorization': `Bearer ${token.token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      
  };
    await axios.post('/AcctTransactDateRange',
        postData,
       config
    )
        .then(response => {
          
            //  console.log(response);
  debugger;
            const rowData = response.data;
            populateAcctTransactionRptData(rowData.ocAcctTransaction)
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
        <AcctTransactionGrid data={AcctTransactionRptData} />
         
         
      </div>
    )
  }
  
  export default AcctTransactionRpt