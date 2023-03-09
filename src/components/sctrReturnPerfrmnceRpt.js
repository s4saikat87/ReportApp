import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import SelectControl from './selectcontrol';
import Loading from './loading';
import Header  from './header';
import SctrReturnPerformanceGrid from './sctrReturnPerfrmnceGrid'

const SctrReturnPerformanceRpt = () => {
    const [SctrReturnPerformanceRptData, populateSctrReturnPerformanceRptData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [flag, setFlag]=useState(0);

    useEffect(() => {
      
        const fetchData = async () => {
             setLoading(true);
            try {
                //let data = location.state;
    
                let userId = JSON.parse(localStorage.getItem('userId'));// data.Email;
               
                //setEmail(email);
                GetSctrReturnPerformanceData();
              
                //  console.log(data);
            } catch (error) {
                console.error(error.message);
            }
    
        }
        fetchData();
    }, [])

    const GetSctrReturnPerformanceData = async () => {
        //debugger;
        setLoading(true);
      
         let token = JSON.parse(localStorage.getItem('token'));
         let AsOfId = JSON.parse(localStorage.getItem('userId'));
         let acctIds = 0;
         let PageId = 1;
         const postData = {AsOfId, acctIds, PageId};
         const config = {
            headers: {
              'authorization': `Bearer ${token.token}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          
      };
        await axios.post('/RTSectorRetPerfrmnce',
            postData,
           config
        )
            .then(response => {
              
                //  console.log(response);
      //debugger;
                const rowData = response.data;
                populateSctrReturnPerformanceRptData(rowData);
                setLoading(false);
                setFlag(1);      
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
       {flag===1?
        <SctrReturnPerformanceGrid  data={SctrReturnPerformanceRptData}/>
        :<></>
       }
    </div>
  )
}

export default SctrReturnPerformanceRpt


