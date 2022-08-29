import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Grid, GridColumn as Column, GridToolbar } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import { ExcelExport } from '@progress/kendo-react-excel-export';



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
    const [locked, setLocked] = React.useState(false);

  const handleClick = () => {
    setLocked(!locked);
  };
    const _export = React.useRef(null);

    const excelExport = () => {
    if (_export.current !== null) {
        _export.current.save(resultState);
    }
  };

  const totalSum = (props) => {
    const field = props.field || "";
    const total = data.reduce((acc, current) => acc + current[field], 0).toFixed(2);
    return (
      <td colSpan={props.colSpan} style={props.style}>
        {total}
      </td>
    );
  };

  const initialDataState = {};
  const [row, setRow] = useState(data);
  const [dataState, setDataState] = React.useState();
  const [resultState, setResultState] = React.useState(
    process(row, initialDataState)
  );
  //setResultState(process({data}, initialDataState))
  let total = row.length;
  let pageSize = 10;
  const [page, setPage] = React.useState({
    skip: 0,
    take: pageSize,
  });
  const onDataStateChange = React.useCallback((e) => {
   debugger;
    setDataState(e.dataState);
    //let gridData = data;
    const groups = e.dataState.group;

    if (groups) {
      groups.map((group) => (group.aggregates = aggregates));
    }
    e.dataState.group = groups;
   setResultState( process(row,e.dataState));
  }, []);

  

  

  const cellRender = (tdElement, cellProps) => {
    debugger;
    
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
        {
        
        <div className='card-header row d-flex justify-content-between align-items-center my-2'>

          <div className='col'>
            <p className='tableheader h6'>Account Transactions Report</p>
            </div>
            <div className='col'></div>
          <div className='col'>
          <button className='btn btn-outline-primary btn-sm' onClick={excelExport}>Export to Excel</button>

            </div>


        </div>
        /* <div className="card mx-2 my-2">
            <div className="card-header tableheader">Account Transaction Report</div>
        </div> */}
        <div className="card-body">
        <div className="mx-1 px-1 my-1 py-1">
        <ExcelExport data={resultState} ref={_export}> 
       <Grid style={{ height: "600px" }}
            data={resultState}
       
            groupable={{
              footer: "visible",
            }}
            sortable={true}
            //pageSize={pageSize}
           // total={total}
           // filterable={true}
           onDataStateChange={onDataStateChange}
           {...dataState}

            cellRender={cellRender}
          >
            {/* <GridToolbar>
              <div className="card-header">Account Transaction Report</div>
          <button
            title="Export Excel"
            className="btn btn-outline-primary float-right"
            onClick={excelExport}
          >
            Export to Excel
          </button>
        </GridToolbar> */}
            <Column field="branchName" menu={true} title="Branch" width="150px" locked={true}/>
            <Column field="accountType" menu={true} title="Account Type" width="150px" locked={true}/>
            <Column field="accountName" menu={true} title="Account Name" width="150px" locked={true}/>
            {/* <Column field="prcsDt" menu={true} title="Trans. Date" width="150px" /> */}
            <Column field="tranTypNm" menu={true} title="Trans. Type" width="150px" />
            
            <Column field="totalLine" menu={true} title="Description" width="300px" />
            <Column field="administrator" title="Administrator" width="150px" />
            <Column field="investmentOfficer" title="Inv Officer" width="150px" />
            

            <Column field="pCash" title="Principal($)" format="{0:n2}" width="150px" filter="numeric" footerCell={totalSum} filterable={false}/>
            <Column field="iCash" title="Income($)" width="150px" filter="numeric" footerCell={totalSum} filterable={false}/>
            <Column field="shares" title="Shares" width="150px" filter="numeric" footerCell={totalSum} filterable={false} />
            

            {/* <Column
            field="PriceHistory"
            title="Price history"
            cell={SparkLineChartCell}
          /> */}
            {/* <Column
            field="Discontinued"
            width="130px"
            cell={props => (
              <td>
                <input
                  className="k-checkbox"
                  type="checkbox"
                  disabled
                  defaultChecked={props.dataItem[props.field]}
                />
                <label className="k-checkbox-label" />
              </td>
            )}
          /> */}
          </Grid>
          </ExcelExport>   
          </div>
          </div>
    </div>
  )
}

export default AcctTransactionGrid