import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import SelectControl from './selectcontrol';
import Loading from './loading';
import Header  from './header';
// import AcctSectBenchRptGrid from './AccountSectBenchGrid';
import "@progress/kendo-theme-material/dist/all.css";
import AcctPerfRptGrid from './AcctPerfRptGrid'

const AcctPerfRpt = () => {
    
    const  [AcctPerfRptData1, populateAcctPerfRptData1] = useState([]);
    const  [AcctPerfRptData2, populateAcctPerfRptData2] = useState([]);
    const  [AcctPerfRptData3, populateAcctPerfRptData3] = useState([]);
    const [flag, setFlag] = useState(0);
    const [loading, setLoading] = useState(true);
    //const []

    useEffect(() => {
      
        const fetchData = async () => {
            //debugger; 
            setLoading(true);
 

             
            try {
                
    
                let asOfId = JSON.parse(localStorage.getItem('userId'));// data.Email;
               
               
                GetAcctSectBenchRptData();
              
                
            } catch (error) {
                console.error(error.message);
            }
    
        }
        fetchData();
    }, [])

    const GetAcctSectBenchRptData = async () => {
        //debugger;
        setLoading(true);
      
         let token = JSON.parse(localStorage.getItem('token'));
         let AsOfId = JSON.parse(localStorage.getItem('userId'));
         let PageId = 1;
         let StartDate = "01/01/2021"
         let EndDate = "03/31/2022"
         const postData = {AsOfId, StartDate, EndDate, PageId};
         const config = {
            headers: {
              'authorization': `Bearer ${token.token}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          
      };
        await axios.post('/AccountPerformanceSummary',
            postData,
           config
        )
            .then(response => {
              
                //  console.log(response);
      //debugger;
                const rowData = response.data;
                debugger;
                populateAcctPerfRptData1(rowData.lstAccountPerformanceSummaryActivity);
                populateAcctPerfRptData2(rowData.lstAccountPerformanceSummaryAllocation);
                populateAcctPerfRptData3(rowData.lstAccountPerformanceSummaryROR);
                setLoading(false);
                setFlag(1);
      
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
       {
            flag === 1? <AcctPerfRptGrid data={AcctPerfRptData1} alloc ={AcctPerfRptData2} /> : <></>

       }
        
    </div>
  )
}

export default AcctPerfRpt


