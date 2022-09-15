import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Grid, GridColumn as Column, GridToolbar } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import { ExcelExport } from '@progress/kendo-react-excel-export';
import { formatNumber, formatDate  } from '@telerik/kendo-intl';
import {
  setExpandedState,
  setGroupIds,
} from "@progress/kendo-react-data-tools";
import { groupBy } from "@progress/kendo-data-query";


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
  

  const PortfolioHoldingGrid = ({data}) => {
    debugger;
    const _export = React.useRef(null);
   
    const _grid = React.useRef();
    const excelExport = () => {
    if (_export.current !== null) {
        _export.current.save(resultState);
    }
  };

  const totalSum = (props) => {
    const field = props.field || "";
    const total = data.reduce((acc, current) => acc + current[field], 0).toFixed(2);
    return (
      <td colSpan={props.colSpan} style={{textAlign:'right'}}>
        Sum: {total}
      </td>
    );
  };

  const initialDataState = {
    skip: 0,
    take: 10,
  };



  const [row, setRow] = useState(data);
  const [dataState, setDataState] = React.useState();
  const [resultState, setResultState] = React.useState(
    process(row, initialDataState)
  );
  const [collapsedState, setCollapsedState] = React.useState(process(row, initialDataState));
  
  const onExpandChange = React.useCallback(
    (event) => {
      const item = event.dataItem;

      if (item.groupId) {
        const newCollapsedIds = !event.value
          ? [...collapsedState, item.groupId]
          : collapsedState.filter((groupId) => groupId !== item.groupId);
        setCollapsedState(newCollapsedIds);
      }
    },
    setResultState(process(row,collapsedState))
  );
  /*const newData = setExpandedState({
    data: resultState,
    collapsedIds: collapsedState,
  });*/

  
  
  
  
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
    debugger;
    if (cellProps.rowType === "footer") {
      debugger;
      if (cellProps.field === "pCash") {

        return (
          <td aria-colindex={cellProps.columnIndex} role={"gridcell"}>
            Sum: {cellProps.dataItem.aggregates.pCash.sum}
          </td>
        );
      }
    }
    if (cellProps.rowType === "groupFooter") {

      if (cellProps.field === "pCash") {

        return (
          <td aria-colindex={cellProps.columnIndex} role={"gridcell"}>
            Sum: {cellProps.dataItem.aggregates.pCash.sum}
          </td>
        );
      }
      if (cellProps.field === "iCash") {

        return (
          <td aria-colindex={cellProps.columnIndex} role={"gridcell"}>
            Sum: {cellProps.dataItem.aggregates.iCash.sum}
          </td>
        );
      }
      if (cellProps.field === "shares") {

        return (
          <td aria-colindex={cellProps.columnIndex} role={"gridcell"}>
            Sum: {cellProps.dataItem.aggregates.shares.sum}
          </td>
        );
      }
    }

    return tdElement;
  };
  return (
    
    <div>
        <div className="card mx-2 my-2">
            <div className="card-header tableheader">Account Transaction Report</div>
        </div>
        <div className="container-fluid">
        <div className="row text-center">
        <ExcelExport data={resultState} ref={_export}> 
       <Grid style={{ height: "430px" }}
            data={resultState}
            //data={newData}
            groupable={{
              footer: "visible"
            }}
            onExpandChange={onExpandChange}
            sortable={true}
            pageable={{pageSize:true}}
            pageSize={pageSize}
           // total={total}
           // filterable={true}
           onDataStateChange={onDataStateChange}
           {...dataState}

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
            <Column field="branchName" menu={true} title="Branch" width="150px" />
            <Column field="accountType" menu={true} title="Account Type" width="150px" />
            <Column field="accountName" menu={true} title="Account Name" width="150px" />
            {/* <Column field="prcsDt" menu={true} title="Trans. Date" width="150px" /> */}
            <Column field="acctAlphaSortKey" menu={true} title="AcctAlphaSortKey" width="150px" />
            
            <Column field="admin" menu={true} title="Admin" width="300px" />
            <Column field="administrator" title="Administrator" width="150px" />
            <Column field="investmentOfficer" title="Inv Officer" width="150px" />
            <Column field="inv" title="Inv" width="150px" />
            <Column field="lastShort" title="Last Short" width="150px" />
            <Column field="assetShrtNm" title="Asst Short Name" width="150px" />
            <Column field="maturityDt" title="Maturity Date" width="150px" />
            <Column field="majorAssetType" title="Major Asset Type" width="150px" />
            <Column field="minorAssetType" title="Minor Asset Type" width="150px" />
            <Column field="units" title="Units" width="150px" />
            <Column field="shares" title="Shares" width="150px" />
            <Column field="market" title="Market" width="150px" />
            <Column field="cusip" title="Cusip " width="150px" />
            <Column field="ticker" title="Ticker" width="150px" />
            <Column field="txcstAmt" title="Tax Cost Amount " width="150px" />
            <Column field="price" title="Price" width="150px" />
            <Column field="gainLoss" title="Gain Loss" width="150px" />
            <Column field="income" title="Income" width="150px" />    
            <Column field="yield" title="Yield" width="150px" />
            <Column field="industryTypeName" title="Industry Type Name" width="150px" />
            <Column field="totMarket" title="Total Market" width="150px" />
            <Column field="priceDate" title="Price Date" width="150px" />
            <Column field="excldAssetMsg" title="ExcldAssetMsg" width="150px" />
            <Column field="p1CashBlncAmt" title="P1CashBlncAmt" width="150px" />
            <Column field="p2P3CashBlncAmt" title="P2 P3 CashBlncAmt" width="150px" />
            <Column field="unExecCashAmt" title="UnExecCashAmt" width="150px" />
            <Column field="tradeCash" title="Trade Cash" width="150px" />
            <Column field="excldCashAmt" title="ExcldCashAmt" width="150px" />


            <Column field="equityPercent" title="Equity Percent" width="150px" />
            <Column field="invstmntObj" title="Investment Objective" width="150px" />
            <Column field="modelNm" title="modelNm" width="150px" />
            <Column field="intDivRate" title="Int Div Rate" width="150px" />
            <Column field="issueId" title="Issue Id" width="150px" />
            <Column field="secSrtNm" title="SecSrtNm" width="150px" />
            

            
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

export default PortfolioHoldingGrid