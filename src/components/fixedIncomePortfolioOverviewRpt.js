import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import SelectControl from './selectcontrol';
import { filterBy } from '@progress/kendo-data-query';

import Enumerable from 'linq';
import Loading from './loading';
import Header  from './header';
import FixedIncomePortfolioOverviewGrid from './fixedIncomePortfolioOverviewGrid';
// import "@progress/kendo-theme-material/dist/all.css";
import {
  AutoComplete,
  ComboBox,
  MultiColumnComboBox,
  DropDownList,
  MultiSelect,
  DropDownTree,
} from "@progress/kendo-react-dropdowns";
//import "@progress/kendo-theme-default/dist/all.css";
import data from './selectcontrol';
const FixedIncomePortfolioOverviewRpt = () => {

  const [table1,setTableChart1]=useState([]);
    const [table2,setTableChart2]=useState([]);
    const [table3,setTableChart3]=useState([]);
    const [table4,setTableChart4]=useState([]);
    const [table5,setTableChart5]=useState([]);
  
  const [selAcctData, setSelAcctData] = useState(JSON.parse(localStorage.getItem('acctData')).slice());
  const [selAcct, SetselAcct] = useState(localStorage.getItem('IsAcctSelected')? JSON.parse(localStorage.getItem('AcctSelected')):JSON.parse(localStorage.getItem('acctData'))[0]);
   
  const [FixedIncomePortfolioOverviewRptData, populateFixedIncomePortfolioOverviewRptData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
   
    
    const fetchData = async () => {
    
         setLoading(true);
        try {
            //let data = location.state;

            let AsOfId = JSON.parse(localStorage.getItem('userId'));// data.Email;
           
            //setEmail(email);
            FixedIncomePortfolioOverviewData();
          
            //  console.log(data);
        } catch (error) {
            console.error(error.message);
        }

    }
    fetchData();
}, [])

const filterData = (filter) => {
   
  // const dataAcct = selAcctData.slice();
   return filterBy(JSON.parse(localStorage.getItem('acctData')).slice(), filter);
 };

 const filterChange = (event) => {
   
   setSelAcctData(filterData(event.filter));
 };
const handleChange = (event) => {
debugger;
  if (event.target.value === null) {
    SetselAcct(JSON.parse(localStorage.getItem('acctData'))[0]);
    //GetUpdatedAccountProfile(0);
    localStorage.setItem('IsAcctSelected', false);
    localStorage.setItem('AcctSelected',JSON.stringify(JSON.parse(localStorage.getItem('acctData'))[0]));
    }
  else {
    SetselAcct(event.target.value);
    localStorage.setItem('IsAcctSelected', true);
    localStorage.setItem('AcctSelected', JSON.stringify(event.target.value));
    console.log(event.target.value);
    
    //GetUpdatedAccountProfile(event.target.value.acctId);
  }
    
};
const FixedIncomePortfolioOverviewData = async () => {
    debugger;
    setLoading(true);
  
     let token = JSON.parse(localStorage.getItem('token'));
     let AsOfId = JSON.parse(localStorage.getItem('userId'));
     let pageId = 1;
     AsOfId=1744;
     const postData = {AsOfId,pageId};
     const config = {
        headers: {
          'authorization': `Bearer ${token.token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      
  };
    await axios.post('/FixedIncomePortfolioOverview',
        postData,
       config
    )
        .then(response => {
          debugger;
            //  console.log(response);
  
            const rowData = response.data;
            populateFixedIncomePortfolioOverviewRptData(rowData);
            
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
        <div className='row d-flex justify-content-start align-items-center py-2 mt-1 px-2 mx-2 bg-light shadow-sm rounded'>
          <div className='subheader text-end col-md-1'> &nbsp; Account(s):</div>
          <div className='col-md-4 text-start'>
            <ComboBox
              style={{
                width: "350px",
              }}
              data={selAcctData}
              textField="extrnlAcctId"
              dataItemKey="acctId"
              filterable={true}
              value={selAcct}
              onChange={handleChange}
              onFilterChange={filterChange}
            />
          </div>
          {/* <div className='col-md-2'>
            <button className='btn btn-sm btn-outline-secondary px-2' ><FaPrint></FaPrint> &nbsp; Export to PDF</button>
          </div> */}
          </div>
      <Loading />
   </>
    )
  }
  
    return (
      <div>
        <Header></Header>
        <div className='row d-flex justify-content-start align-items-center py-2 mt-1 px-2 mx-2 bg-light shadow-sm rounded'>
          <div className='subheader text-end col-md-1'> &nbsp; Account(s):</div>
          <div className='col-md-4 text-start'>
            <ComboBox
              style={{
                width: "350px",
              }}
              data={selAcctData}
              textField="extrnlAcctId"
              dataItemKey="acctId"
              filterable={true}
              value={selAcct}
              onChange={handleChange}
              onFilterChange={filterChange}
            />
          </div>
          {/* <div className='col-md-2'>
            <button className='btn btn-sm btn-outline-secondary px-2' ><FaPrint></FaPrint> &nbsp; Export to PDF</button>
          </div> */}
          </div>
         
         <FixedIncomePortfolioOverviewGrid data={FixedIncomePortfolioOverviewRptData} />
         
         
      </div>
    )

}
export default FixedIncomePortfolioOverviewRpt