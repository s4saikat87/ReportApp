import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import AcctTransactionGrid from './acctTransactionGrid';
import AcctHoldingGrid from './acctHoldingGrid';
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { DatePicker } from "@progress/kendo-react-dateinputs";

import Header  from './header';
import Loading from './loading';
import {
    IntlProvider,
    load,
    loadMessages,
    LocalizationProvider,
  } from "@progress/kendo-react-intl";
import { TextField } from '@mui/material';
const DateRange = ({data}) => {
  debugger;
    const locales = [
        {
          language: "1",
          locale: "specify",
        },
        {
          language: "2",
          locale: "90Days",
        },
      ];
      const [AcctHoldingRptData, populateAcctHoldingRptData] = useState([])
      const [filterData, populateAcctTransactionRptData] = useState(data);
      const [loading, setLoading] = useState(true);
      //const [dpFrm, setDpFrm] = React.useState(new Date("2021-06-30"));
      //const [locale, setLocale] = React.useState(locales[0]);
      const [frmDate, setfrmDate] = React.useState(new Date("2021-04-22"));
      const [toDate, setToDate] = React.useState(new Date("2022-04-22"));
      const[isDisabled,setisDisabled]= React.useState(false);
      const[flag,setFlag]= React.useState(false);
      const[flagHolding, setflagHolding] = React.useState(false);
      //const value = new Date("2022-04-22");
      const minFrmDt = new Date(2021,4,22);
      const maxFrmDt = new Date(2022,2,22);

      useEffect(() => {
    debugger;
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

      function setDate (val){
        debugger;

        // if(val.language === '1'){
        //     const fDate = new Date("2021-04-22");
            
        //     setfrmDate(fDate);
        //     const setisDisabled = false;
        // }
        // if(val.language === '2'){
        //     const fDate = new Date("2021-01-22");
            
        //     setfrmDate(fDate);
        //     const setisDisabled = true;
        // }
        setfrmDate(val);
    }
    const searchClick = () => {
        
        GetAcctTransactionData();
      };   
      const GetAcctTransactionData = async () => {
        debugger;
        setLoading(true);
      
         let token = JSON.parse(localStorage.getItem('token'));
         let userId = JSON.parse(localStorage.getItem('userId'));
         let startDate = frmDate;//"06/30/2021";
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
               // const rowData = response.data;
               
                populateAcctTransactionRptData(response.data.ocAcctTransaction);
                //setisSearchClicked(true);
                setFlag(true);
                //localStorage.setItem('isSearchClicked', true);
                //localStorage.setItem('searchedData', JSON.stringify(response.data.ocAcctTransaction));
                setLoading(false);
      
            })
            .catch((error) => {
      
                return error;
            });
            
      }
      const GetAcctHoldinData = async () => {
        debugger;
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
                populateAcctHoldingRptData(rowData.ocAcctHolding);
                setflagHolding(true);
                setLoading(false);
      
            })
            .catch((error) => {
      
                return error;
            });
      
      }
      if (loading) {
        return(
          <>
           
          <Loading />
       </>
        )
      }
return(
    <div>
      <div>
        {flagHolding?
          <AcctHoldingGrid data={AcctHoldingRptData} />:<></>}
      </div>
      <hr/>

      <div className='row card-header d-flex align-items-center py-2 mx-1 border-0 shadow-none'>
        <div className='col-md-3 col-lg-3 col-sm-10'>
              <span className='tableheader h6'>Transactions Report</span>
        </div>
        <div className='col-md-3 col-lg-3 col-sm-10'>
          <span className='py-1'>From</span>
        <DatePicker id="dpFrm"
              defaultValue={frmDate}
              format="dd/MMM/yyyy"
              min={minFrmDt}
              max={maxFrmDt}
              disabled={isDisabled}
              onChange={(e)=>{
                setDate(e.value);
                
              }}
            
            />

        </div>

        <div className='col-md-3 col-lg-3 col-sm-10'>
        <span className='py-1'>To</span>
        <DatePicker
              disabled={true}
              defaultValue={toDate}
              format="dd/MMM/yyyy"
            />


        </div>

        <div className='col-md-2 col-lg-2 col-sm-10'>

        <button className='btn btn-primary btn-sm' onClick={searchClick}>Submit</button>

        </div>



      </div>



     
    
      {/* {loading ? <Loading/>:<></>} */}
    {flag ? <AcctTransactionGrid data={filterData} ></AcctTransactionGrid>
    :<AcctTransactionGrid data={data} ></AcctTransactionGrid> 
    } 
    
    </div>
)
};
export default DateRange