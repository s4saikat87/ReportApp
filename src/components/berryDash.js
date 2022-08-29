import React from 'react'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import SelectControl from './selectcontrol';


import { FaSyncAlt } from 'react-icons/fa';

const BerryDash = ({data,mjrData,mnrData,astData}) => {
  return (
   
    <div>



      
<SelectControl data={data} mjrAllData={mjrData} mnrAllData={mnrData} assetAllData={astData} />



        {/* <div className="pageheader p-2 m-2 bg-light d-flex justify-content-between align-items-center">
      
<button className="btn btn-outline-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
  Account Selector
</button>

<label className="fw-bold mx-3">All Accounts</label>

<button className="btn btn-outline-primary" type="button">
<div className='px-1'><FaSyncAlt /></div>
</button>
</div>

<div className="offcanvas offcanvas-start" data-bs-scroll="true" data-bs-backdrop="false" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
  <div className="offcanvas-header">
    <h5 className="offcanvas-title" id="offcanvasExampleLabel">Account Selector</h5>
    <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div className="offcanvas-body">
    <div>
   
    </div>
    
      
      
    
  </div>
</div> */}
 


    </div>
  )
}

export default BerryDash
