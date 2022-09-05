import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Grid, GridColumn as Column, GridToolbar } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import { ExcelExport } from '@progress/kendo-react-excel-export';
import Moment from 'react-moment';
import { formatNumber, formatDate  } from '@telerik/kendo-intl';
import { ColumnMenu } from "./columnMenu";
import {
  setGroupIds,
  getGroupIds,
  setExpandedState,
} from "@progress/kendo-react-data-tools";
import { textAlign } from '@mui/system';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
const aggregates = [
    {
      field: "shares",
      aggregate: "sum",
    },
    {
        field: "market",
        aggregate: "sum",
    },
    {
        field: "yield",
        aggregate: "average",
    }
  
  ];
  const initialGroup = [
    {
      field: "accountNumber",
      field: "mtrtyYr",
    }  
  ];

  const initialDataState = {
    skip: 0,
  take: 10,
  };

  const processWithGroups = (data, dataState) => {
    const newDataState = process(data, dataState);
    setGroupIds({
      data: newDataState.data,
      group: dataState.group,
    });
    return newDataState;
  };
const FixdIncmFundmntlsGrid = ({data}) => {
  
    const _export = React.useRef(null);
    const _grid = React.useRef();
    const excelExport = () => {
    if (_export.current !== null) {
        _export.current.save(data);
    }
  };


  const totalSum = (props) => {
    const field = props.field || "";
    const total = data.reduce((acc, current) => acc + current[field], 0);
    return (
      <td colSpan={props.colSpan} style={{textAlign:"right"}}>
       { formatNumber(total, "##,#.00")}
        
      </td>
    );
  };
  const avgYield = (props) => {
    debugger;
    const field = props.field;
    const len=data.length;
    const average = data.reduce((acc, current) => acc + current[field],0)/len;
    return (
      <td colSpan={props.colSpan} style={{textAlign:"right"}}>
        Avg: { formatNumber(average, "##,#.00")}
      </td>
    );
  }; 

  
  const [row, setRow] = useState(data);
  const [dataState, setDataState] = React.useState();
  const [resultState, setResultState] = React.useState(
    processWithGroups(row, initialDataState)
  );
  //setResultState(process({data}, initialDataState))
  
  const [page, setPage] = React.useState(initialDataState);
  const [collapsedState, setCollapsedState] = React.useState([]);
  const[ChkBoxState,setChkBoxState]=useState(true);
  const onDataStateChange = React.useCallback((e) => {
 
    
    //let gridData = data;
    const groups = e.dataState.group;

    if (groups) {
      groups.map((group) => (group.aggregates = aggregates));
    }
    e.dataState.group = groups;
   setResultState( processWithGroups(row,e.dataState));
   setDataState(e.dataState);
   //setChkBoxState(true);
  }, []);

  const NumberCell = (props) => {
    return (
        <td style={{ textAlign: 'right' }}>
            {formatNumber(props.dataItem[props.field], "##,#.00")}
        </td>
    )
}
const IntCell = (props) => {
  return (
      <td style={{ textAlign: 'right' }}>
          {props.dataItem[props.field]}
      </td>
  )
}

const RightNameHeader = (props) => {
    return (
        <a className="k-link" style={{
            float: "right",
        }} onClick={props.onClick}>
            {/* <span className="k-icon k-i-cart" /> */}
            <span
                style={{
                    // color: "#53d2fa",
                }}
            >
                {props.title}
            </span>
            {props.children}
        </a>
    );
};

  const cellRender = (tdElement, cellProps) => {    
    
    
    if (cellProps.rowType === "data")
    {
    let cpnRate="", matrtyDate="";

    if(cellProps.field==="yldToMtrty" || cellProps.field==="yldCalPut")
      {
        return (
          (ChkBoxState===true)?
          <>
          <td aria-colindex={cellProps.columnIndex} role={"gridcell"}>
            { formatNumber(cellProps.dataItem["yldToMtrty"], "##,#.00")}
          </td>
          </>:
          <>
          <td aria-colindex={cellProps.columnIndex} role={"gridcell"}>
            { formatNumber(cellProps.dataItem["yldCalPut"], "##,#.00")}
          </td>
          </>
      );
      }
      if(cellProps.field==="duration" || cellProps.field==="calPutDuration")
      {
        return (
          (ChkBoxState===true)?
          <>
          <td aria-colindex={cellProps.columnIndex} role={"gridcell"}>
            { formatNumber(cellProps.dataItem["duration"], "##,#.00")}
          </td>
          </>:
          <>
          <td aria-colindex={cellProps.columnIndex} role={"gridcell"}>
            { formatNumber(cellProps.dataItem["calPutDuration"], "##,#.00")}
          </td>
          </>
      );
      }
    
    if(cellProps.field==="maturityDt")
    {
      
      const value = cellProps.field;{/* this.props.dataItem[this.props.field];*/}      
      return (
          <td aria-colindex={cellProps.columnIndex} role={"gridcell"}>
            {/*  {formatDate(new Date( cellProps.dataItem[value]), "d")}*/}
              <Moment format="MM/DD/YYYY">
              {cellProps.dataItem[value]}
            </Moment>
          </td>
      );
    }
    if(cellProps.field==="astShrtNm")
    {
      cpnRate=cellProps.dataItem["couponRate"];
      matrtyDate=cellProps.dataItem["maturityDt"];
      return (
        <td aria-colindex={cellProps.columnIndex} role={"gridcell"}>
          {cellProps.dataItem[cellProps.field]}&nbsp;{ formatNumber(cpnRate, "##,#.00")}%&nbsp;
            <Moment format="MM/DD/YYYY">
            {matrtyDate}
          </Moment>
          &nbsp;
        </td>
    );
    }
  }

    if (cellProps.rowType === "groupFooter") {

      if (cellProps.field === "shares") {

        return (
          <td aria-colindex={cellProps.columnIndex} role={"gridcell"}>
            {cellProps.dataItem.aggregates.shares.sum}
          </td>
        );
      }
      if (cellProps.field === "market") {

        return (
          <td aria-colindex={cellProps.columnIndex} role={"gridcell"}>
            {cellProps.dataItem.aggregates.market.sum}
          </td>
        );
      }
      if (cellProps.field === "yield") {

        return (
          <td aria-colindex={cellProps.columnIndex} role={"gridcell"}>
            { formatNumber(cellProps.dataItem.aggregates.yield.average, "##,#.00")}
          </td>
        );
      }
    }

    return tdElement;
  };
  const ShowMaturityCallPut=(e)=>{
    setChkBoxState(e.target.checked);
    setDataState(e.dataState);
  };

  const pageChange = (event) => {
    setPage(event.page);
  };

  const onExpandChange = React.useCallback(
    (event) => {
      debugger;
      const item = event.dataItem;

      if (item.groupId) {
        const newCollapsedIds = !event.value
          ? [...collapsedState, item.groupId]
          : collapsedState.filter((groupId) => groupId !== item.groupId);
          debugger;
        setCollapsedState(newCollapsedIds);
      }
    },
    [collapsedState]
  );

  const newData = setExpandedState({
    data: resultState.data,
    collapsedIds: collapsedState,
  });
  return (
    
    <div>
        <div className="card mx-2 my-2">
            <div className="card-header tableheader">Fixed Income Fundamentals Report</div>
        </div>
        
        
        <div className="container-fluid">
        <div className="row text-center">
        {ChkBoxState?
        <ExcelExport data={resultState} ref={_export}> 
       <Grid style={{ height: "650px" }}
            data={newData}
            //data={resultState.slice(page.skip, page.skip + page.take)}
            groupable={{
              footer: "visible",
            }}

           
            sortable={true}
            skip={page.skip}
            pageable={{
              pageSizes: true,
            }}
            pageSize={page.take}
            total={data.length}
           
            ref={_grid}
           // total={total}
           // filterable={true}
           onDataStateChange={onDataStateChange}
           {...dataState}
           onExpandChange={onExpandChange}
           expandField="expanded"
            cellRender={cellRender}
          >
            <GridToolbar>
          <button
            title="Export Excel"
            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
            onClick={excelExport}
          >
            Export to Excel
          </button>
          <FormGroup>
      <FormControlLabel control={<Checkbox name='chkShwMtrtyCall' defaultChecked onChange={ShowMaturityCallPut}/>} label="Duration to Maturity/Call" />
    </FormGroup>
        </GridToolbar>
            <Column field="accountNumber" menu={true} title="Account Number" columnMenu={ColumnMenu}  width="150px"  />
            <Column field="accountName" menu={true} title="Account Name" columnMenu={ColumnMenu}  width="170px"  />
            <Column field="mtrtyYr" menu={true} title="Maturity Year" columnMenu={ColumnMenu} cell={IntCell} headerCell={RightNameHeader} width="120px"  />
            <Column field="astShrtNm" menu={true}  title="Description" width="300px" columnMenu={ColumnMenu} />

            <Column field="shares" title="Shares" width="150px" filter="numeric" format="{0:n2}" columnMenu={ColumnMenu} cell={NumberCell} headerCell={RightNameHeader}  footerCell={totalSum} filterable={false}/>
            <Column field="market" title="Market($)" width="150px" format="{0:n2}" filter="numeric" columnMenu={ColumnMenu} cell={NumberCell} headerCell={RightNameHeader}  footerCell={totalSum} filterable={false}/>
            
            <Column field="yldToMtrty" title="YTM%" width="85px" filter="numeric" format="{0:n2}" columnMenu={ColumnMenu} cell={NumberCell} headerCell={RightNameHeader}  footerCell={avgYield}  filterable={false} />
            <Column field="duration" title="Duration To Maturity" width="160px" filter="numeric" format="{0:n2}" columnMenu={ColumnMenu} cell={NumberCell} headerCell={RightNameHeader}  footerCell={avgYield}  filterable={false} />
            
            <Column field="yield" title="Current Yield%" width="150px" filter="numeric" format="{0:n2}" columnMenu={ColumnMenu} cell={NumberCell} headerCell={RightNameHeader}  footerCell={avgYield}  filterable={false} />
            <Column field="moodyRating" menu={true} title="Moody Rating" width="150px" columnMenu={ColumnMenu} />
            <Column field="spRating" menu={true} title="SP Rating" width="150px" columnMenu={ColumnMenu} />
            
          </Grid>
          </ExcelExport>   
:
<ExcelExport data={resultState} ref={_export}> 
<Grid style={{ height: "650px" }}
     data={newData}
     //data={resultState.slice(page.skip, page.skip + page.take)}
     groupable={{
       footer: "visible",
     }}

    
     sortable={true}
     skip={page.skip}
     pageable={{
       pageSizes: true,
     }}
     pageSize={page.take}
     total={data.length}
    
     ref={_grid}
    // total={total}
    // filterable={true}
    onDataStateChange={onDataStateChange}
    {...dataState}
    onExpandChange={onExpandChange}
    expandField="expanded"
     cellRender={cellRender}
   >
     <GridToolbar>
   <button
     title="Export Excel"
     className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
     onClick={excelExport}
   >
     Export to Excel
   </button>
   <FormGroup>
<FormControlLabel control={<Checkbox name='chkShwMtrtyCall' defaultChecked onChange={ShowMaturityCallPut}/>} label="Duration to Maturity/Call" />
</FormGroup>
 </GridToolbar>
     <Column field="accountNumber" menu={true} title="Account Number" columnMenu={ColumnMenu}  width="150px"  />
     <Column field="accountName" menu={true} title="Account Name" columnMenu={ColumnMenu}  width="170px"  />
     <Column field="mtrtyYr" menu={true} title="Maturity Year" columnMenu={ColumnMenu} cell={IntCell} headerCell={RightNameHeader} width="120px"  />
     {/*<Column field="couponRate" menu={true} title="Coupon Rate" width="150px" />
     <Column field="maturityDt"  menu={true}  filter="date" title="Maturity Date" width="150px" />*/}
     <Column field="astShrtNm" menu={true}  title="Description" width="300px" columnMenu={ColumnMenu} />


     <Column field="shares" title="Shares" width="150px" filter="numeric" format="{0:n2}" columnMenu={ColumnMenu} cell={NumberCell} headerCell={RightNameHeader}  footerCell={totalSum} filterable={false}/>
     <Column field="market" title="Market($)" width="150px" format="{0:n2}" filter="numeric" columnMenu={ColumnMenu} cell={NumberCell} headerCell={RightNameHeader}  footerCell={totalSum} filterable={false}/>
     
     <Column field="yldCalPut" title="YTW%" width="85px" filter="numeric" format="{0:n2}" columnMenu={ColumnMenu} cell={NumberCell} headerCell={RightNameHeader}  footerCell={avgYield}  filterable={false} />
     <Column field="calPutDuration" title="Duration To Call/Put" width="160px" filter="numeric" format="{0:n2}" columnMenu={ColumnMenu} cell={NumberCell} headerCell={RightNameHeader}  footerCell={avgYield}  filterable={false} />
     
     <Column field="yield" title="Current Yield%" width="150px" filter="numeric" format="{0:n2}" columnMenu={ColumnMenu} cell={NumberCell} headerCell={RightNameHeader}  footerCell={avgYield}  filterable={false} />
     <Column field="moodyRating" menu={true} title="Moody Rating" width="150px" columnMenu={ColumnMenu} />
     <Column field="spRating" menu={true} title="SP Rating" width="150px" columnMenu={ColumnMenu} />
     

   </Grid>
   </ExcelExport>       
    }

          </div>
          </div>
    </div>
  )
}

export default FixdIncmFundmntlsGrid