import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import SelectControl from './selectcontrol';

import Loading from './loading';
import Header  from './header';
import GridMjrAsset from './gridMjrAsset';
import BerryDash from './berryDash';
import Enumerable from 'linq';

 //import "@progress/kendo-theme-default/dist/all.css";
 //import "@progress/kendo-theme-bootstrap/dist/all.css";
 //import "@progress/kendo-theme-material/dist/all.css";

 const Dashboard = () => {
  const [email, setEmail] = useState("");
  const [accountGet, setAccountGet] = useState([]);
  const [roleGet, setroleGet] = useState("");
  const [cntctId, setcntctId] = useState("");
  const [mjrAcctDtls, setMjrAcctDtls] = useState([]);
  const [mnrAcctDtls, setMnrAcctDtls] = useState([]);
  const [assetDtls, setAssetDtls] = useState([]);
  const [loading, setLoading] = useState(true);
  const[initMV,setInitMV]=useState(0);
  const[initCash,setInitCash]=useState(0);
  useEffect(() => {
    const fetchData = async () => {
         setLoading(true);
        try {
            //let data = location.state;

            let email = JSON.parse(localStorage.getItem('email'));// data.Email;
           
            setEmail(email);
            GetDefaultData();
          
            //  console.log(data);
        } catch (error) {
            console.error(error.message);
        }

    }
    fetchData();
}, [])


const GetDefaultData = async () => {
  setLoading(true);

   let token = JSON.parse(localStorage.getItem('token'));
 
  let EmailAdrs=JSON.parse(localStorage.getItem('email'));
   const postData = {EmailAdrs};
   const config = {
      headers: {
        'authorization': `Bearer ${token.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    
};
  await axios.post('/RTGetDefault',
      postData,
     config
  )
      .then(response => {

          //  console.log(response);

          const rowData = response.data;
          let contactId= rowData.contact[0].cntctId;
          let roleId= rowData.role[0].roleTypId;
          setroleGet(roleId);
          setcntctId(contactId);
          localStorage.setItem('userId', contactId);
          localStorage.setItem('roleId', roleId);
          GetADVAccountProfile(roleId,contactId)

         // setRowGet(rowData);

        //  setLoading(false);

      })
      .catch((error) => {

          return error;
      });

}


const GetADVAccountProfile = async (roleId,cntctId) => {
 // setLoading(true);

   let token = JSON.parse(localStorage.getItem('token'));
  let RoleTypId=roleId;
  let UserId=cntctId;
  let EmailAdrs=JSON.parse(localStorage.getItem('email'));
   const postData = {UserId,RoleTypId};
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

          const rowData = response.data;
         debugger;
        
          setAccountGet(rowData.t1);
          localStorage.setItem('acctData', JSON.stringify(rowData.t1));
        
          let mjrData=Enumerable.from(rowData.t2).where(w => w.mvPercent !== 0)
          .toArray();
          let mnrData=Enumerable.from(rowData.t3).where(w => w.mvPercent !== 0)
          .toArray();
          let assetData=Enumerable.from(rowData.t4).where(w => w.mvPercent !== 0)
          .toArray();
          debugger;
          let cash=rowData.t5[0].cash;
          let mv=rowData.t5[0].mv;
          setMjrAcctDtls(mjrData);
          setMnrAcctDtls(mnrData);
          setAssetDtls(assetData);
         setInitCash(cash);
         setInitMV(mv);
          setLoading(false);

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
      
     <BerryDash data={accountGet} mjrData={mjrAcctDtls} mnrData={mnrAcctDtls} astData={assetDtls} initMV={initMV} initCash={initCash}/>





     
    </div>
  )
}

export default Dashboard
