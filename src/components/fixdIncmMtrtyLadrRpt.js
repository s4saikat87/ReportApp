import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import SelectControl from './selectcontrol';
import Loading from './loading';
import Header  from './header';
import FixdIncmMaturityLadrGrid from './fixdIncmMtrtyLadrGrd';
import "@progress/kendo-theme-material/dist/all.css";
import FixdIncmMaturityLadrGrd from './fixdIncmMtrtyLadrGrd';

const FixdIncmMaturityLadrRpt = () => {
    const [fimlRptMainDataSet, populateFimlRptMainDataSet] = useState([]);
    const [fimlRptCalDtls, populateFimlRptSecondDataSet] = useState([]);
    const [fimlRptmatVsCallPut, populateFimlRptThirdDataSet] = useState([]);
    const [loading, setLoading] = useState(true);
    const [flag, setFlag]=useState(0);

    useEffect(() => {
      
        const fetchData = async () => {
             setLoading(true);
            try {
                //let data = location.state;
    
                let userId = JSON.parse(localStorage.getItem('userId'));// data.Email;
               
                //setEmail(email);
                GetFixdIncmMaturityLadrRptData();
              
                //  console.log(data);
            } catch (error) {
                console.error(error.message);
            }
    
        }
        fetchData();
    }, [])

    const GetFixdIncmMaturityLadrRptData = async () => {
        debugger;
        setLoading(true);
      
         let token = JSON.parse(localStorage.getItem('token'));
         let UserId = JSON.parse(localStorage.getItem('userId'));
         let acctIds = "";
         let PrstInd=0;
         let StrtDt="";
         let EndDt="";
         let AsOfDt="04/20/2022";
         let PriceDt="04/20/2022";
         let PriceFlag=1;
         let IsConsolidation=false;
         let ShowExcldAst=true;
         let PageId = 1;
         
         const postData = {UserId, acctIds, PrstInd, StrtDt, EndDt, AsOfDt, PriceDt, PriceFlag, IsConsolidation, ShowExcldAst, PageId};
         const config = {
            headers: {
              'authorization': `Bearer ${token.token}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          
      };
        await axios.post('/RTFixdIncmMaturity',
            postData,
           config
        )
            .then(response => {
              
                //  console.log(response);
      debugger;
                const rowData = response.data;
                populateFimlRptMainDataSet(rowData.fIM1);
                populateFimlRptSecondDataSet(rowData.fIM2);
                populateFimlRptThirdDataSet(rowData.fIM3);
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
       {flag===1?
        <FixdIncmMaturityLadrGrd data={fimlRptMainDataSet} callDetails={fimlRptCalDtls} matVsCallPut={fimlRptmatVsCallPut}  />
        :<></>

       }
    </div>
  )
}

export default FixdIncmMaturityLadrRpt


