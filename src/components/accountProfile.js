import React from 'react'
import { useState, useEffect,useRef  } from 'react';
import axios from 'axios';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import SelectControl from './selectcontrol';
import {
  AutoComplete,
  ComboBox,
  MultiColumnComboBox,
  DropDownList,
  MultiSelect,
  DropDownTree,
} from "@progress/kendo-react-dropdowns";
import { GridPDFExport, PDFExport,savePDF  } from "@progress/kendo-react-pdf";
import { filterBy } from '@progress/kendo-data-query';
import Loading from './loading';
import Header from './header';

import { FaSignOutAlt, FaMoneyBill, FaPrint, FaFunnelDollar, FaChalkboard, FaListAlt, FaRegChartBar,FaDonate,FaChartLine,FaDice, FaUserAlt, FaCogs, FaWindowMinimize, FaBackward, FaFilePdf, FaFileExport } from 'react-icons/fa';

import AcctHoldingGrid from './acctHoldingGrid';
//import "@progress/kendo-theme-material/dist/all.css";
//import "@progress/kendo-theme-default/dist/all.css";
import AccountProfAssetClass from './accountProfAssetClass';
import AcctAstPreview from './acctAstPreview';
const AccountProfile = () => {
  const [acctProfileRptData, setAcctProfileRptData] = useState([]);
  const [acctPortVsModelData, setAcctPortVsModelData] = useState([]);
  const [topHoldingData, setTopHoldingData] = useState([]);
  const[modelData,setModelData]=useState([]);
  const[modelId,setModelId]=useState(0);
  const [loading, setLoading] = useState(true);
const[acctUpdateStat,setAcctUpdateStat]=useState(0);
  const [selAcctData, setSelAcctData] = useState(JSON.parse(localStorage.getItem('acctData')).slice());

  const [selAcct, SetselAcct] = useState(JSON.parse(localStorage.getItem('acctData'))[0]);
  const [selectedAcct,setSelectedAcct]=useState(0);
  const [preview,SetPreview]=useState(false);
  useEffect(() => {

    const fetchData = async () => {

      try {
        //let data = location.state;

        let userId = JSON.parse(localStorage.getItem('userId'));// data.Email;


        //setEmail(email);
        GetAcctProfileData();

        //  console.log(data);
      } catch (error) {
        console.error(error.message);
      }

    }
    fetchData();
  }, [])


  const GetAcctProfileData = async () => {
    setLoading(true);

    let token = JSON.parse(localStorage.getItem('token'));
    let UserId = JSON.parse(localStorage.getItem('userId'));

    let Accounts = "<root> <Account AcctId='" + selAcct.acctId + "'/> </root>";
    let AcctId = selAcct.acctId;
    setSelectedAcct(selAcct.acctId);

    const postData = { AcctId };
    const config = {
      headers: {
        'authorization': `Bearer ${token.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }

    };
    await axios.post('/GetModelInfo',
      postData,
      config
    )
      .then(response => {

        //  console.log(response);

        // const rowData = response.data.ocAcctProfile;
        //  setAcctProfileRptData(rowData);
        //  populateAcctHoldingRptData(rowData.ocAcctHolding)
      
        const rowData = response.data;
        
       setModelData(rowData.model) ;
       // setLoading(false);
        let modelId=rowData.acctMdl[0].modelId;
        setModelId(modelId);
        getInfo(modelId);

       

      })
      .catch((error) => {

        return error;
      });

  }
  const getInfo =async (modelId) => {
   // setLoading(true);
    
    let token = JSON.parse(localStorage.getItem('token'));
    let UserId = JSON.parse(localStorage.getItem('userId'));

    let Accounts = "<root> <Account AcctId='" + selAcct.acctId + "'/> </root>";
    
    let AcctId=selAcct.acctId;
    let invMix=0;
    let NumOfRows=10;
   
   // const postData = {UserId,Accounts};
    const postData = {UserId,Accounts,modelId,invMix,NumOfRows,AcctId};
    const config = {
      headers: {
        'authorization': `Bearer ${token.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }

    };
    await axios.post('/AccountProfile',
      postData,
      config
    )
      .then(response => {

        //  console.log(response);
       debugger;
        const rowData = response.data[0];
         const acctProfData = rowData.accountProf.ocAcctProfile;
         const assetVsModelData=rowData.assetAllocVsMod.ocAssetAllocVsModel;
         const topHoldingsData=rowData.topHold.ocTopHolding;
          setAcctProfileRptData(acctProfData);
          setAcctPortVsModelData(assetVsModelData);
          setTopHoldingData(topHoldingsData);
        //  populateAcctHoldingRptData(rowData.ocAcctHolding)
        setAcctUpdateStat(1);
       // const rowData = response.data;
       setLoading(false);
       
       

      })
      .catch((error) => {

        return error;
      });


  }


  const handleChange = (event) => {

    if (event.target.value === null) {
      //SetselAcct('');
      SetselAcct(selAcct);
     // GetAcctProfileData();
      // GetUpdatedAccountProfile(0);
    }
    else {
      SetselAcct(event.target.value);
      localStorage.setItem('changeInvMix',JSON.stringify(event.target.value) );
      GetAcctProfileData();
      //GetUpdatedAccountProfile(event.target.value.acctId);
    }



  };

  const filterData = (filter) => {
   
   // const dataAcct = selAcctData.slice();
    return filterBy(JSON.parse(localStorage.getItem('acctData')).slice(), filter);
  };

  const filterChange = (event) => {
    
    setSelAcctData(filterData(event.filter));
  };

  const container = useRef(null);

  const exportPDFWithMethod = () => {
    
    let element = container.current || document.body;
    savePDF(element, {
      paperSize: "auto",
      margin: 40,
      fileName: `Report for ${new Date().getFullYear()}`,
    });
  };

  const handlePreview=()=>{
    SetPreview(true);

  }

  const handlePage=()=>{
    SetPreview(false);
  }

if (loading) {
  
        return(
        <>
         <Header />
         <div  className='my-1'>

      <div className="rounded"></div>

         
         <div className='row d-flex justify-content-start align-items-center py-2 mt-1 px-2 mx-2 bg-light shadow-sm rounded'>
       
        <div className='col-md-4 col-lg-4 col-sm-11 text-start'>
          <span className='px-2'>Account(s)</span>
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
        

        <div className='row d-flex justify-content-center align-item-center px-2 my-2'>


          
          <div className='col-sm-10 col-lg-4 col-md-4 card text-left m-1'>
            <div className='card-body'>
            <div className='d-block'><FaChartLine /></div>
            <div className='d-block text-primary'><label>Market Value:</label></div>
            <div className='d-block'><h4 id='lblMrktVal'>${selAcct.availableCash.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</h4></div>
            </div>
          </div>
          <div className='col-sm-10 col-lg-3 card text-left m-1'>
            <div className='card-body'>
            <div className='d-block'><FaMoneyBill /></div>
            <div className='d-block text-primary'><label>Avaialble Cash:</label></div>
            <div className='d-block'><h4 id='lblAvlCash'>${selAcct.excludedCash.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</h4></div>
            </div>
          </div>
          <div className='col-sm-10 col-lg-3 card text-left m-1'>
            <div className='card-body'>
            <div className='d-block'><FaFunnelDollar /></div>
            <div className='d-block text-primary'><label>Exclude Cash:</label></div>
            <div className='d-block'><h4 id='lblExcludeCash'>${selAcct.mrktVlAmt.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</h4></div>
            </div>
          </div>


          </div>

        {/* <div className='col-md-2 text-right'>
          <label>Market Value:</label>  <label id='lblMrktVal'>${selAcct.availableCash.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</label>
        </div>
        <div className='col-md-2 text-right'>
          <label>Avaialble Cash:</label>  <label id='lblAvlCash'>${selAcct.excludedCash.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</label>
        </div>
        <div className='col-md-2 text-right'>
          <label>Exclude Cash:</label>  <label id='lblExcludeCash'>${selAcct.mrktVlAmt.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</label>
        </div> */}
      </div>
      
      
         <Loading />
        </>
        
        )
     
    }
  return (
    <div>
      <Header />
      <div ref={container}>



       




       

      <div className='row d-flex justify-content-start align-items-center py-2 mt-1 px-2 mx-2 rounded'>

        <div className='row bg-light shadow-sm'>
        
        <div className='col-md-4 text-start my-1'>
        <span className='px-2'>Account(s)</span>
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
        {
           preview?<div className='col-md-2 col-sm-6 col-lg-2 my-1'>
           <button className='btn btn-sm btn-outline-primary px-2' onClick={exportPDFWithMethod}><FaFilePdf></FaFilePdf> &nbsp; Export to PDF</button>
         </div>
         :<></>

        }
        
        <div className='col-md-2 col-sm-6 col-lg-2 my-1'>
          {
            !preview? <button className='btn btn-sm btn-outline-secondary px-2' onClick={handlePreview} ><FaFileExport></FaFileExport> &nbsp; Export Preview</button>
            : <button className='btn btn-sm btn-outline-secondary px-2' onClick={handlePage} ><FaBackward></FaBackward> &nbsp; Exit Preview</button>
          }
          
        </div>
        </div>
       

        <div  className='row d-flex justify-content-center align-item-center px-2 my-2 bg-white'>


          
          <div className='col-sm-10 col-lg-3 card text-left m-1'>
            <div className='card-body'>
            <div className='d-block'><FaChartLine /></div>
            <div className='d-block text-primary'><label>Market Value:</label></div>
            <div className='d-block'><h4 id='lblMrktVal'>${selAcct.availableCash.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</h4></div>
            </div>
          </div>
          <div className='col-sm-10 col-lg-3 card text-left m-1'>
            <div className='card-body'>
            <div className='d-block'><FaMoneyBill /></div>
            <div className='d-block text-primary'><label>Avaialble Cash:</label></div>
            <div className='d-block'><h4 id='lblAvlCash'>${selAcct.excludedCash.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</h4></div>
            </div>
          </div>
          <div className='col-sm-10 col-lg-3 card text-left m-1'>
            <div className='card-body'>
            <div className='d-block'><FaFunnelDollar /></div>
            <div className='d-block text-primary'><label>Exclude Cash:</label></div>
            <div className='d-block'><h4 id='lblExcludeCash'>${selAcct.mrktVlAmt.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</h4></div>
            </div>
          </div>


          </div>
      </div>
            {
              acctUpdateStat===1 && !preview?
              <AccountProfAssetClass data={acctProfileRptData} astVsModelData={acctPortVsModelData} topHoldData={topHoldingData} allmodelData={modelData} selModelId={modelId} selDrdAcct={selectedAcct} loading={loading}/>
              :acctUpdateStat===1 && preview?
              <AcctAstPreview data={acctProfileRptData} astVsModelData={acctPortVsModelData} topHoldData={topHoldingData} allmodelData={modelData} selModelId={modelId} selDrdAcct={selectedAcct} loading={loading}/>
              :<></>
              
            }
      
    </div>
    </div>
  )
}

export default AccountProfile
