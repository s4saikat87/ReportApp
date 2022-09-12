import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import SelectControl from './selectcontrol';
import Loading from './loading';
import Header  from './header';
import AcctSectBenchRptGrid from './AccountSectBenchGrid';
import "@progress/kendo-theme-material/dist/all.css";

const AcctSectBenchRpt = () => {
    
    const  [AcctSectBenchRptData1, populateAcctSectBenchRptData1] = useState([]);
    const  [AcctSectBenchRptData2, populateAcctSectBenchRptData2] = useState([]);
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
         let mAsOfId = JSON.parse(localStorage.getItem('userId'));
         let pageId = 1;
         let mBenchMark = 1480;
         const postData = {mAsOfId, pageId, mBenchMark};
         const config = {
            headers: {
              'authorization': `Bearer ${token.token}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          
      };
        await axios.post('/AccountSectorsBenchmark',
            postData,
           config
        )
            .then(response => {
              
                //  console.log(response);
      //debugger;
                const rowData = response.data;
                debugger;
                populateAcctSectBenchRptData1(rowData.ocAcctSectT1);
                populateAcctSectBenchRptData2(rowData.ocAcctSectT2);
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
            flag === 1? <AcctSectBenchRptGrid data={AcctSectBenchRptData2} /> : <></>

       }
        
    </div>
  )
}

export default AcctSectBenchRpt


