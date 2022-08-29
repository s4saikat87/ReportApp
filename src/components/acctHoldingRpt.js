import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import SelectControl from './selectcontrol';

import Loading from './loading';
import Header  from './header';
import AcctHoldingGrid from './acctHoldingGrid';
// import "@progress/kendo-theme-material/dist/all.css";
import "@progress/kendo-theme-default/dist/all.css";
 const AcctHoldingRpt = () => {
  
  const [AcctHoldingRptData, populateAcctHoldingRptData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    
    const fetchData = async () => {
         setLoading(true);
        try {
            //let data = location.state;

            let userId = JSON.parse(localStorage.getItem('userId'));// data.Email;
           
            //setEmail(email);
            GetAcctHoldinData();
          
            //  console.log(data);
        } catch (error) {
            console.error(error.message);
        }

    }
    fetchData();
}, [])


const GetAcctHoldinData = async () => {
  setLoading(true);

   let token = JSON.parse(localStorage.getItem('token'));
   let userId = JSON.parse(localStorage.getItem('userId'));
   let pageId = 1;
   const postData = {userId, pageId};
   const config = {
      headers: {
        'authorization': `Bearer ${token.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    
};
  await axios.post('/AcctHolding',
      postData,
     config
  )
      .then(response => {
        
          //  console.log(response);

          const rowData = response.data;
          populateAcctHoldingRptData(rowData.ocAcctHolding)
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

       
       <AcctHoldingGrid data={AcctHoldingRptData} />
       
       
    </div>
  )
}

export default AcctHoldingRpt