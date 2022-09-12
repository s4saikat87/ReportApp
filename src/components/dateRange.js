import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import AcctTransactionGrid from './acctTransactionGrid';
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import Loading from './loading';
import Header  from './header';
import {
    IntlProvider,
    load,
    loadMessages,
    LocalizationProvider,
  } from "@progress/kendo-react-intl";
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
      const [filterData, populateAcctTransactionRptData] = useState(data);
      const [loading, setLoading] = useState(true);
      //const [dpFrm, setDpFrm] = React.useState(new Date("2021-06-30"));
      //const [locale, setLocale] = React.useState(locales[0]);
      const [frmDate, setfrmDate] = React.useState(new Date("2021-04-22"));
      const [toDate, setToDate] = React.useState(new Date("2022-04-22"));
      const[isDisabled,setisDisabled]= React.useState(false);
      const[flag,setFlag]= React.useState(false);

      //const value = new Date("2022-04-22");
      const minFrmDt = new Date(2021,4,22);
      const maxFrmDt = new Date(2022,2,22);
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
      
return(
    <div>
      <div className='row g-2 mx-2 my-2 bg-white d-flex align-items-center justify-content-start'>  
      <div className='col-sm-12 col-md-1  text-center fw-bold'>Select Date</div>      
         
           <div className='col-sm-2 col-md-1 col-form-label text-end'>From</div> 
           <div className='col-sm-10 col-md-3 col-lg-3'>          
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
        
          
          <div className='col-sm-2 col-md-1 col-form-label text-end'>To</div>
          <div className='col-sm-10 col-md-3 col-lg-3'> 
            <DatePicker
              disabled={true}
              defaultValue={toDate}
              format="dd/MMM/yyyy"
            />
          
        </div>
        <div className='col text-center'>
          <button className='btn btn-outline-secondary btn-sm' onClick={searchClick}>Submit</button>
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