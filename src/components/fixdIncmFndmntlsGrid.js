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
        field: "yield",
        aggregate: "average",
    }
  
  ];
  const initialGroup = [
    {
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
      <td colSpan={props.colSpan} style={props.style}>
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
      <td colSpan={props.colSpan} style={props.style}>
         { formatNumber(average, "##,#.00")}
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
  const onDataStateChange = React.useCallback((e) => {
 
    
    //let gridData = data;
    const groups = e.dataState.group;

    if (groups) {
      groups.map((group) => (group.aggregates = aggregates));
    }
    e.dataState.group = groups;
   setResultState( processWithGroups(row,e.dataState));
   setDataState(e.dataState);
  }, []);

  const NumberCell = (props) => {
    return (
        <td style={{ textAlign: 'right' }}>
            {formatNumber(props.dataItem[props.field], "##,#.00")}
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
        </GridToolbar>
            <Column field="mtrtyYr" menu={true} title="Maturity Year" columnMenu={ColumnMenu} cell={NumberCell} headerCell={RightNameHeader} width="150px"  />
            {/*<Column field="couponRate" menu={true} title="Coupon Rate" width="150px" />
            <Column field="maturityDt"  menu={true}  filter="date" title="Maturity Date" width="150px" />*/}
            <Column field="astShrtNm" menu={true}  title="Description" width="300px" columnMenu={ColumnMenu} />



           {/* <Column field="BranchName" menu={true} title="Branch" width="150px" />
            <Column field="AccountType" menu={true} title="Account Type" width="150px" />
            <Column field="AccountName" menu={true} title="Account Name" width="150px" />
             <Column field="prcsDt" menu={true} title="Trans. Date" width="150px" />
            <Column field="tranTypNm" menu={true} title="Trans. Type" width="150px" />
            
            <Column field="totalLine" menu={true} title="Description" width="300px" />
            <Column field="administrator" title="Administrator" width="150px" />
        <Column field="investmentOfficer" title="Inv Officer" width="150px" />*/}
            

            <Column field="shares" title="Shares" width="150px" filter="numeric" format="{0:n2}" columnMenu={ColumnMenu} cell={NumberCell} headerCell={RightNameHeader}  footerCell={totalSum} filterable={false}/>
            <Column field="market" title="Market($)" width="150px" format="{0:n2}" filter="numeric" columnMenu={ColumnMenu} cell={NumberCell} headerCell={RightNameHeader}  footerCell={totalSum} filterable={false}/>
            <Column field="yield" title="Yield%" width="150px" filter="numeric" format="{0:n2}" columnMenu={ColumnMenu} cell={NumberCell} headerCell={RightNameHeader}  footerCell={avgYield}  filterable={false} />

            <Column field="moodyRating" menu={true} title="Moody Rating" width="150px" columnMenu={ColumnMenu} />
            <Column field="sPRating" menu={true} title="SP Rating" width="150px" columnMenu={ColumnMenu} />
            

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

export default FixdIncmFundmntlsGrid