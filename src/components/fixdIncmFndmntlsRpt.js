import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import SelectControl from './selectcontrol';
import Loading from './loading';
import Header  from './header';
import FixdIncmFndmntlsGrid from './fixdIncmFndmntlsGrid';
import "@progress/kendo-theme-material/dist/all.css";

const FixdIncmFndmntlsRpt = () => {
    const [FixedIncmFundmntlRptData, populateFixedIncmFundmntlRptData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      
        const fetchData = async () => {
             setLoading(true);
            try {
                //let data = location.state;
    
                let userId = JSON.parse(localStorage.getItem('userId'));// data.Email;
               
                //setEmail(email);
                GetFixdIncmFndmntlsReportData();
              
                //  console.log(data);
            } catch (error) {
                console.error(error.message);
            }
    
        }
        fetchData();
    }, [])

    const GetFixdIncmFndmntlsReportData = async () => {
        debugger;
        setLoading(true);
      
         let token = JSON.parse(localStorage.getItem('token'));
         let userId = JSON.parse(localStorage.getItem('userId'));
         let acctIds = "";
         let pageId = 1;
         const postData = {userId, acctIds, pageId};
         const config = {
            headers: {
              'authorization': `Bearer ${token.token}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          
      };
        await axios.post('/RTFixdIncmFndmntl',
            postData,
           config
        )
            .then(response => {
              
                //  console.log(response);
      debugger;
                const rowData = response.data;
                populateFixedIncmFundmntlRptData(rowData)
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
        <FixdIncmFndmntlsGrid data={FixedIncmFundmntlRptData} />
    </div>
  )
}

export default FixdIncmFndmntlsRpt


