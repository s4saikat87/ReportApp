import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import SelectControl from './selectcontrol';

import Loading from './loading';
import Header  from './header';
import DateRange  from './dateRange';
import AcctTransactionGrid from './acctTransactionGrid';

const AcctTransactionRpt = () => {
  
    const [AcctTransactionRptData, populateAcctTransactionRptData] = useState([]);
    const [loading, setLoading] = useState(true);
   
    const[firstFlag,setFirstFlag]=useState(0);
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
            setFirstFlag(1);
            setLoading(false);
  
        })
        .catch((error) => {
  
            return error;
        });
  
  }
  
  if (loading) {
    return(
      <>
        <Header></Header>
      <Loading />
   </>
    )
  }
  
    return (
      <div>
        <Header></Header>
        
       {firstFlag===1?<DateRange data={AcctTransactionRptData} loadFlag={firstFlag}/>:<></>}
         {/* {!isClicked?<AcctTransactionGrid data={AcctTransactionRptData} />:<></>}  */}
       
         
      </div>
    )
  }
  
  export default AcctTransactionRpt