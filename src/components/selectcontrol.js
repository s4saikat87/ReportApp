import React from 'react'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

import Loading from './loading';
import GridMjrAsset from './gridMjrAsset';
import { Grid, GridColumn as Column, GridToolbar } from "@progress/kendo-react-grid";
import axios from 'axios';
import {
  AutoComplete,
  ComboBox,
  MultiColumnComboBox,
  DropDownList,
  MultiSelect,
  DropDownTree,
} from "@progress/kendo-react-dropdowns";
import { FaSyncAlt } from 'react-icons/fa';
import { filterBy } from '@progress/kendo-data-query';
import { useState, useEffect } from 'react';
const SelectControl = ({ data, mjrAllData, mnrAllData, assetAllData }) => {
  const [selAcct, SetselAcct] = useState('');
  const [dataAcct, setDataAcct] = React.useState(data.slice());
  const [updatedMjrData, setUpdatedMjrData] = useState(mjrAllData);
  const [updatedMnrData, setUpdatedMnrData] = useState(mnrAllData);
  const [updatedAssetData, setUpdatedAssetData] = useState(assetAllData);
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

        setUpdatedMjrData(rowData.t2);
        setUpdatedMnrData(rowData.t3);
        setUpdatedAssetData(rowData.t4);
        setAvailableCash(rowData.t1[0].availableCash);
        setExcludedCash(rowData.t1[0].excludedCash);
        setMrktVlAmt(rowData.t1[0].mrktVlAmt);
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

  // if (loading) {
  //   return <Loading />
  // }
  return (
    <div className='my-2'>

      <div className="row d-flex justify-content-start align-items-center pt-2 mt-2 bg-light">


        <div className='subheader text-right col-md-1'> &nbsp; Account(s):</div>
        <div className='col-md-4 text-left'>
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
        {
          chngeSelect===1 ?
          <>
          <div className='col-md-2 text-right'>
          <label>Market Value:</label>  <label id='lblMrktVal'>${availableCash.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</label>
          </div>
          <div className='col-md-2 text-right'>
          <label>Avaialble Cash:</label>  <label id='lblAvlCash'>${excludedCash.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</label>
          </div>
          <div className='col-md-2 text-right'>
          <label>Exclude Cash:</label>  <label id='lblExcludeCash'>${mrktVlAmt.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</label>
          </div>
          </>
          :
          <>
          <div className='col-md-2 text-right'>
          <label>All Accounts</label> 
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

      <GridMjrAsset data={updatedMjrData} mnrData={updatedMnrData} astData={updatedAssetData} loading={loading} />











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
