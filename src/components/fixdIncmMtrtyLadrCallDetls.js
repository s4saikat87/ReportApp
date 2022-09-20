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
        field: "income",
        aggregate: "sum",
    },
    {
        field: "marketPercent",
        aggregate: "sum",
    },
    {
        field: "yield",
        aggregate: "average",
    }
  
  ];
  const initialGroup = [
    {
      field: "callOrPutYr",
    }  
  ];

  const initialDataState = {
    skip: 0,
  take: 10,
  };

const FixdIncmMaturityLadrCallDetls = ({data, chkState}) => {
  
   //debugger;
  const totalSum = (props) => {
    const field = props.field || "";
    const total = data.reduce((acc, current) => acc + current[field], 0);
    return (
      <td colSpan={props.colSpan} style={{textAlign:"right"}}>
       { formatNumber(total, "##,#.00")}
        
      </td>
    );
  };
  const totalPercent = (props) => {
    const field = props.field || "";
    const total = data.reduce((acc, current) => acc + current[field], 0)*100;
    return (
      <td colSpan={props.colSpan} style={{textAlign:"right"}}>
       { formatNumber(total, "##,#.00")}
        
      </td>
    );
  };
  const avgYield = (props) => {
    
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
  const [resultState, setResultState] = React.useState(initialDataState);
  //setResultState(process({data}, initialDataState))
  
  const [page, setPage] = React.useState(initialDataState);
  
  const onDataStateChange = React.useCallback((e) => { 
   setResultState(e.resultState);
   setDataState(e.dataState);
  }, []);

const NumberCell = (props) => {
    return (
        <td style={{ textAlign: 'right' }}>
            {formatNumber(props.dataItem[props.field], "##,#.00")}
        </td>
    )
}

const ftrText = (props) => {
    
    return (
      <td  style={{textAlign:"left"}}>
        Total Fixed Income Portfolio
      </td>
    );
  };

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

    if(cellProps.field==="shares")
      {
        return (
         
          <td aria-colindex={cellProps.columnIndex} style={{ textAlign: 'right' }}  role={"gridcell"}>
            { formatNumber(cellProps.dataItem[cellProps.field], "##,#.000000")}
          </td>
      );
      }
      if(cellProps.field==="market")
      {
        return (
          
          <td aria-colindex={cellProps.columnIndex} style={{ textAlign: 'right' }}  role={"gridcell"}>
            { formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
          </td>          
      );
      }
      if (cellProps.field === "income") {

        return (
          <td aria-colindex={cellProps.columnIndex} style={{ textAlign: 'right' }}  role={"gridcell"}>
            { formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
          </td>
        );
      }
      if(cellProps.field==="marketPercent")
      {
        //debugger;
        return (
          
          <td aria-colindex={cellProps.columnIndex} style={{ textAlign: 'right' }} role={"gridcell"}>
            { formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
          </td>          
      );
      }
      if (cellProps.field === "yield") {

        return (
          <td aria-colindex={cellProps.columnIndex} style={{ textAlign: 'right' }} role={"gridcell"}>
            { formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
          </td>
        );
      }
    
    if(cellProps.field==="callOrPutYr")
    {
      return (
        <td aria-colindex={cellProps.columnIndex} role={"gridcell"}>
          Callable In&nbsp;{ formatNumber(cellProps.dataItem[cellProps.field], "###")}
        </td>
    );
    }
  }

    if (cellProps.rowType === "groupFooter") {

      if (cellProps.field === "shares") {

        return (
          <td aria-colindex={cellProps.columnIndex} style={{ textAlign: 'right' }}  role={"gridcell"}>
            { formatNumber(cellProps.dataItem.aggregates.shares.sum, "##,#.00")}
          </td>
        );
      }
      if (cellProps.field === "market") {

        return (
          <td aria-colindex={cellProps.columnIndex} style={{ textAlign: 'right' }}  role={"gridcell"}>
            { formatNumber(cellProps.dataItem.aggregates.market.sum, "##,#.00")}
          </td>
        );
      }
      if (cellProps.field === "income") {

        return (
          <td aria-colindex={cellProps.columnIndex} style={{ textAlign: 'right' }}  role={"gridcell"}>
            { formatNumber(cellProps.dataItem.aggregates.income.sum, "##,#.00")}
          </td>
        );
      }
      if (cellProps.field === "marketPercent") {

        return (
          <td aria-colindex={cellProps.columnIndex} style={{ textAlign: 'right' }} role={"gridcell"}>
            { formatNumber(cellProps.dataItem.aggregates.marketPercent.sum, "##,#.00")}
          </td>
        );
      }
      
      if (cellProps.field === "yield") {

        return (
          <td aria-colindex={cellProps.columnIndex} style={{ textAlign: 'right' }} role={"gridcell"}>
           { formatNumber(cellProps.dataItem.aggregates.yield.average, "##,#.00")}
          </td>
        );
      }
      if(cellProps.field==="callOrPutYr")
    {
      return (
        <td aria-colindex={cellProps.columnIndex} role={"gridcell"}>
          Total Fixed Income Portfolio
        </td>
    );
    }
    }

    return tdElement;
  };
  
  const pageChange = (event) => {
    setPage(event.page);
  };

  return (
    
    <div>
       {chkState? 
        
        <div className="container-fluid">
        <div className="row text-center">
        
       <Grid style={{ height: "450px" }}
            data={data}
            // groupable={{
            //   footer: "visible",
            // }}
           
            sortable={true}
            skip={page.skip}
            pageable={{
              pageSizes: true,
            }}
            pageSize={page.take}
            total={data.length}
           
           // total={total}
           // filterable={true}
           resizable={true}
           reorderable={true}
           onDataStateChange={onDataStateChange}
           {...dataState}
          //  onExpandChange={onExpandChange}
          //  expandField="expanded"
            cellRender={cellRender}
          >
            <Column field="callOrPutYr" menu={true}  title="Based On First Call" width="250px" />
            
            <Column field="shares" title="Shares" width="150px" filter="numeric" format="{0:n2}" columnMenu={ColumnMenu} headerCell={RightNameHeader}  filterable={false}/>
            <Column field="market" title="Market Value" width="150px" format="{0:n2}" filter="numeric" columnMenu={ColumnMenu} headerCell={RightNameHeader}   filterable={false} />
            <Column field="income" title="Income" width="150px" format="{0:n2}" filter="numeric" columnMenu={ColumnMenu} headerCell={RightNameHeader}  filterable={false}/>
            <Column field="yield" title="Yield%" width="150px" filter="numeric" format="{0:n2}" columnMenu={ColumnMenu} headerCell={RightNameHeader}   filterable={false}/>
            <Column field="marketPercent" title="Percent" width="200px" filter="numeric" format="{0:n2}" columnMenu={ColumnMenu}  headerCell={RightNameHeader}  filterable={false} />
                        
          </Grid>

          </div>
          </div>
          :
          <div></div>
        }
    </div>
  )
}

export default FixdIncmMaturityLadrCallDetls