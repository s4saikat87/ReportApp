import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Grid, GridColumn as Column, GridToolbar } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import { ExcelExport } from '@progress/kendo-react-excel-export';
import { formatNumber, formatDate  } from '@telerik/kendo-intl';
import { CustomColumnMenu } from "./customColumnMenu";
import { ColumnMenu } from "./columnMenu";


import {
  setGroupIds,
  getGroupIds,
  setExpandedState,
} from "@progress/kendo-react-data-tools";


const aggregates = [
    {
      field: "pCash",
      aggregate: "sum",
    },
    {
        field: "iCash",
        aggregate: "sum",
    },
    {
        field: "shares",
        aggregate: "sum",
    }
  
  ];
  const initialGroup = [
    {
      field: "branchName",
    }
  
  ];


const AcctTransactionGrid = ({data}) => {
  debugger;
  const _export = React.useRef(null);
  const excelExport = () => {
    if (_export.current !== null) {
        _export.current.save(data);
    }
  };
  const [locked, setLocked] = React.useState(false);

  const columnLocked = () => {
    setLocked(!locked);
  };
    const totalSum = (props) => {
      const field = props.field || "";
      const total = data.reduce((acc, current) => acc + current[field], 0).toFixed(2);
      return (
        <td colSpan={props.colSpan} style={props.style}>
           {formatNumber(total, "##,#.00")}
        </td>
      );
    };
   
    
    const columns = [
      {
        title: "Branch",
        field: "branchName",
        minWidth: 150,
        show: true,
        filter: "text",
        locked:true,
      },
      {
        title: "Account",
        field: "accountType",
        minWidth: 150,
        show: true,
        filter: "text",
        locked:true,
      },
      {
        title: "Account#",
        field: "accountName",
        minWidth: 150,
        show: true,
        filter: "text",
        locked:true,
      },
      {
        title: "Trans Type",
        field: "tranTypNm",
        minWidth: 150,
        show: true,
        filter: "text",
        locked:false,
      },
      {
        title: "Description",
        field: "totalLine",
        minWidth: 300,
        show: true,
        filter: "text",
        locked:false,
      },
      {
        title: "Administrator",
        field: "administrator",
        minWidth: 180,
        show: true,
        filter: "text",
        locked:false,
      },
      {
          title: "Inv. Officer",
          field: "investmentOfficer",
          minWidth: 150,
          show: true,
          filter: "text",
          locked:false,
        },
        {
          title: "Principal($)",
          field: "pCash",
          minWidth: 150,
          show: true,
          filter: "numeric",
          locked:false,
          footerCell:{totalSum},
        },
        {
          title: "Income($)",
          field: "iCash",
          minWidth: 150,
          show: true,
          filter: "numeric",
          locked:false,
        },
        {
          title: "Shares",
          field: "shares",
          minWidth: 150,
          show: true,
          filter: "numeric",
          
          locked:false,
        },
    ];
    
    const createDataState = (dataState) => {
      return {
        result: process(data.slice(0), dataState),
        dataState: dataState,
      };
    };
    let initialState = createDataState({
      take: 20,
      skip: 0,
    });

    
    const [result, setResult] = React.useState(initialState.result);
    const [dataState, setDataState] = React.useState(initialState.dataState);
    const [stateColumns, setStateColumns] = React.useState(columns);
    const [currentColumns, setCurrentColumns] = React.useState(columns);

  
  
  

    const dataStateChange = (event) => {
      let updatedState = createDataState(event.dataState);
     setResult(updatedState.result);
    
      setDataState(updatedState.dataState);
    };
  
    const onColumnsSubmit = (columnsState) => {
      setStateColumns(columnsState);
    };
    const setWidth = (minWidth) => {
      let width = minWidth;
      return width;
    };
    
    const handleColumnLockToggle = (columnField, state) => {
      let newColumns = currentColumns.map((column) => {
        if (column.field === columnField) {
          column.locked = state;
        }
  
        return column;
      });
      setCurrentColumns(newColumns);
    }; // place all locked columns first
    
    
     const expandChange = (event) => {
      const isExpanded =
        event.dataItem.expanded === undefined
          ? event.dataItem.aggregates
          : event.dataItem.expanded;
      event.dataItem.expanded = !isExpanded;
      setResult({ ...result });
    };
   
     
   
     const cellRender = (tdElement, cellProps) => {
      
       
       if (cellProps.rowType === "groupFooter") {
   
         if (cellProps.field === "pCash") {
   
           return (
             <td aria-colindex={cellProps.columnIndex} role={"gridcell"}>
                {cellProps.dataItem.aggregates.pCash.sum.toFixed(2)}
             </td>
           );
         }
         if (cellProps.field === "iCash") {
   
           return (
             <td aria-colindex={cellProps.columnIndex} role={"gridcell"}>
                {cellProps.dataItem.aggregates.iCash.sum.toFixed(2)}
             </td>
           );
         }
         if (cellProps.field === "shares") {
   
           return (
             <td aria-colindex={cellProps.columnIndex} role={"gridcell"}>
                {cellProps.dataItem.aggregates.shares.sum.toFixed(2)}
             </td>
           );
         }
       }
   
       return tdElement;
     };
   
    

  return (
    
    <div>
      <div className='card-header row d-flex justify-content-between align-items-center my-2'>

<div className='col'>
  <p className='tableheader h6'>Account Transactions Report</p>
  </div>
  <div className='col'></div>
<div className='col'>
<button className='btn btn-outline-primary btn-sm' onClick={excelExport}>Export to Excel</button>

  </div>

</div>
<div className="card-body">
        <div className="mx-1 px-1 my-1 py-1">
<ExcelExport data={data} ref={_export}>
      <Grid 
      style={{ height: "500px" }}
        data={result}
        {...dataState}
        onDataStateChange={dataStateChange}
        expandField="expanded"
              onExpandChange={expandChange}
            cellRender={cellRender}
        sortable={true}
        pageable={true}
        pageSize={20}
      >
        {stateColumns.map(
          (column, idx) =>
            column.show && (
              <Column
                width={setWidth(column.minWidth)}
                
                locked={column.locked}
                key={idx}
                field={column.field}
                title={column.title}
                filter={column.filter}
                
                columnMenu={(props) => (
                  <CustomColumnMenu
                    {...props}
                    columns={stateColumns}
                    
                    onColumnsSubmit={onColumnsSubmit}
                  />
                )}
              />
            )
        )}
      </Grid>
      </ExcelExport>
      </div>
      </div>
      <br />
    </div>
  )
}

export default AcctTransactionGrid

