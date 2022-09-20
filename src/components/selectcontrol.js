import React from 'react'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

import Loading from './loading';
import GridMjrAsset from './gridMjrAsset';
import { Grid, GridColumn as Column, GridToolbar } from "@progress/kendo-react-grid";
import { GridPDFExport, PDFExport,savePDF  } from "@progress/kendo-react-pdf";
import axios from 'axios';
import Enumerable from 'linq';
import {
  AutoComplete,
  ComboBox,
  MultiColumnComboBox,
  DropDownList,
  MultiSelect,
  DropDownTree,
} from "@progress/kendo-react-dropdowns";
import { FaFunnelDollar, FaMoneyBill, FaPrint, FaSyncAlt } from 'react-icons/fa';
import { filterBy } from '@progress/kendo-data-query';
import { useState, useEffect,useRef } from 'react';

import { FaSignOutAlt, FaChalkboard, FaListAlt, FaRegChartBar,FaDonate,FaChartLine,FaDice, FaUserAlt, FaCogs } from 'react-icons/fa';

const SelectControl = ({ data, mjrAllData, mnrAllData, assetAllData,allMV,allCash,performAll }) => {
 
  const [selAcct, SetselAcct] = useState('');
  const [dataAcct, setDataAcct] = React.useState(data.slice());
  const [updatedMjrData, setUpdatedMjrData] = useState(mjrAllData);
  const [updatedMnrData, setUpdatedMnrData] = useState(mnrAllData);
  const [updatedAssetData, setUpdatedAssetData] = useState(assetAllData);
  const [updatedPerformAllData, setUpdatedPerformAllData] = useState(performAll);
  const [loading, setLoading] = useState(false);
  const [availableCash, setAvailableCash] = useState(0);
  const [excludedCash, setExcludedCash] = useState(0);
  const [mrktVlAmt, setMrktVlAmt] = useState(0);
  const[chngeSelect,setChngSelect]=useState(0);
  



  const filterData = (filter) => {
    const dataAcct = data.slice();
    return filterBy(dataAcct, filter);
  };

  const filterChange = (event) => {
    setDataAcct(filterData(event.filter));
  };
  // const initialFilter = {
  //   logic: "and",
  //   filters: [
  //     {
  //       field: "extrnlAcctId",
  //       operator: "contains",
  //       value: "",
  //     },
  //   ],
  // };
  // const [filter, setFilter] = React.useState(initialFilter);


  const GetUpdatedAccountProfile = async (AcctId) => {
    setLoading(true);

    let token = JSON.parse(localStorage.getItem('token'));
    let RoleTypId = JSON.parse(localStorage.getItem('roleId'));
    let UserId = JSON.parse(localStorage.getItem('userId'));
    //let EmailAdrs=JSON.parse(localStorage.getItem('email'));

    const postData = { UserId, RoleTypId, AcctId };
    const config = {
      headers: {
        'authorization': `Bearer ${token.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }

    };
    await axios.post('/AdvAccountProfile',
      postData,
      config
    )
      .then(response => {

        //  console.log(response);
        debugger;
        const rowData = response.data;

        let mjrData=Enumerable.from(rowData.t2).where(w => w.mvPercent !== 0)
        .toArray();
        let mnrData=Enumerable.from(rowData.t3).where(w => w.mvPercent !== 0)
        .toArray();
        let assetData=Enumerable.from(rowData.t4).where(w => w.mvPercent !== 0)
        .toArray();

        setUpdatedMjrData(mjrData);
        setUpdatedMnrData(mnrData);
        setUpdatedAssetData(assetData);
        setAvailableCash(rowData.t1[0].availableCash);
        setExcludedCash(rowData.t1[0].excludedCash);
        setMrktVlAmt(rowData.t1[0].mrktVlAmt);
        setUpdatedPerformAllData(rowData.t6);
        debugger;
        localStorage.setItem('changeSelect', "1");
        if(AcctId===0)
        setChngSelect(0);
        else
        setChngSelect(1);
        //  setAccountGet(rowData.t1);
        //  setMjrAcctDtls(rowData.t2);
        //  setMnrAcctDtls(rowData.t3);
        //  setAssetDtls(rowData.t4);
        setLoading(false);


      })
      .catch((error) => {

        return error;
      });

  }

  const handleChange = (event) => {

    if (event.target.value === null) {
      SetselAcct('');
      GetUpdatedAccountProfile(0);
    }
    else {
      SetselAcct(event.target.value);
      GetUpdatedAccountProfile(event.target.value.acctId);
    }

    console.log(selAcct);

  };
  const handleReset = (event) => {
    setUpdatedMjrData(mjrAllData);
    setUpdatedMnrData(mnrAllData);
    setUpdatedAssetData(assetAllData);

  }
  const container = useRef(null);
  const exportPDFWithMethod = () => {
    
    let element = container.current || document.body;
    savePDF(element, {
      paperSize: "auto",
      margin: 40,
      fileName: `Report for ${new Date().getFullYear()}`,
    });
  };

  // if (loading) {
  //   return <Loading />
  // }
  return (
    <div className='my-1' ref={container}>

      <div className="rounded">

        <div className='row d-flex justify-content-start align-items-center py-2 mt-1 px-2 mx-2 bg-light shadow-sm rounded'>
        <div className='subheader text-end col-md-1'> &nbsp; Account(s):</div>
        <div className='col-md-4 text-start'>
          <ComboBox
            style={{
              width: "350px",
            }}
            data={dataAcct}
            textField="extrnlAcctId"
            dataItemKey="acctId"
            filterable={true}
            value={selAcct}
            onChange={handleChange}
            onFilterChange={filterChange}
          />
          {/* <MultiSelect
          style={{
            width: "300px",
          }}
          data={data}
          textField="extrnlAcctId"
        dataItemKey="acctId"
         // defaultValue={["Basketball", "Cricket"]}
        /> */}
        </div>
        <div className='col-md-2'>
          <button className='btn btn-sm btn-outline-secondary px-2' onClick={exportPDFWithMethod}><FaPrint></FaPrint> &nbsp; Export to PDF</button>
        </div>
        </div>
        {
          chngeSelect===1 ?
          <>
          <div className='row d-flex justify-content-center align-item-center px-2 my-2'>


          
          <div className='col-sm-10 col-lg-3 card text-left m-1'>
            <div className='card-body'>
            <div className='d-block'><FaChartLine /></div>
            <div className='d-block'><label>Market Value:</label></div>
            <div className='d-block'><h4 id='lblMrktVal'>${availableCash.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</h4></div>
            </div>
          </div>
          <div className='col-sm-10 col-lg-3 card text-left m-1'>
            <div className='card-body'>
            <div className='d-block'><FaMoneyBill /></div>
            <div className='d-block'><label>Available Cash:</label></div>
            <div className='d-block'><h4 id='lblAvlCash'>${excludedCash.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</h4></div>
            </div>
          </div>
          <div className='col-sm-10 col-lg-3 card text-left m-1'>
            <div className='card-body'>
            <div className='d-block'><FaFunnelDollar /></div>
            <div className='d-block'><label>Exclude Cash:</label></div>
            <div className='d-block'><h4 id='lblExcludeCash'>${mrktVlAmt.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</h4></div>
            </div>
          </div>


          </div>
          </>
          :
          <>
          
          <div className='row d-flex justify-content-center align-item-center px-2 my-2'>


          
<div className='col-sm-10 col-lg-3 card text-left m-1'>
  <div className='card-body'>
  <div className='d-block'><FaChartLine /></div>
  <div className='d-block'><label>Market Value:</label></div>
  <div className='d-block'><h4 id='lblMrktVal'>${allMV.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</h4></div>
  </div>
</div>
<div className='col-sm-10 col-lg-3 card text-left m-1'>
  <div className='card-body'>
  <div className='d-block'><FaMoneyBill /></div>
  <div className='d-block'><label>Available Cash:</label></div>
  <div className='d-block'><h4 id='lblAvlCash'>${allCash.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</h4></div>
  </div>
</div>



</div>
          </>

        }

       



        {/* <div className='col-md-4 text-right'>
      <button className="btn btn-outline-primary" type="button" onClick={handleReset}>
<div className='px-1'><FaSyncAlt /></div>
</button>
</div> */}
      </div>




      {/* <UpdateControl updatedMjrData={updatedMjrData} updatedMnrData={updatedMnrData} updatedAssetData={updatedAssetData} /> */}

      <GridMjrAsset data={updatedMjrData} mnrData={updatedMnrData} astData={updatedAssetData} loading={loading} performData={updatedPerformAllData} />











      {/* <InputLabel id="selectLabel">Account</InputLabel>
                                    <Select name="selAccount"  displayEmpty onChange={handleChange} label="Account" style={{ minWidth: 220 }} labelId="selectLabel" >
                                        <MenuItem value="">
                                            <em>--Select Account--</em>
                                        </MenuItem>
                                        {data.map((options) => (
                                            <MenuItem key={options.acctId} value={options.acctId}>
                                                {options.extrnlAcctId}
                                            </MenuItem>
                                        ))}
      </Select> */}

    </div>
  )
}

export default SelectControl
