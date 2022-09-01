import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Grid, GridColumn as Column, GridToolbar } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import { ExcelExport } from '@progress/kendo-react-excel-export';
import { formatNumber, formatDate  } from '@telerik/kendo-intl';
import { ColumnMenu } from "./columnMenu";
import {
  setGroupIds,
  getGroupIds,
  setExpandedState,
} from "@progress/kendo-react-data-tools";
const aggregates = [
  {
    field: "cost",
    aggregate: "sum",
  },
  {
    field: "market",
    aggregate: "sum",
  },
  {
    field: "unrGainLoss",
    aggregate: "sum",
  },
  {
    field: "principalCash",
    aggregate: "sum",
  },
  {
    field: "incomeCash",
    aggregate: "sum",
  },
  {
    field: "investedIncome",
    aggregate: "sum",
  }

];
const initialGroup = [
  {
    field: "branch",
  }

];
const processWithGroups = (data, dataState) => {
  const newDataState = process(data, dataState);
  setGroupIds({
    data: newDataState.data,
    group: dataState.group,
  });
  return newDataState;
};
const AcctHoldingGrid = ({data}) => {
  const [locked, setLocked] = React.useState(false);

  const handleClick = () => {
    setLocked(!locked);
  };
  
  const _grid = React.useRef();
  const _export = React.useRef(null);

    const excelExport = () => {
    if (_export.current !== null) {
        _export.current.save(data);
    }
  };

  const totalSum = (props) => {
    const field = props.field || "";
    const total = data.reduce((acc, current) => acc + current[field], 0).toFixed(2);
    return (
      <td colSpan={props.colSpan} style={{textAlign:'right'}}>
         {total}
      </td>
    );
  };
  const initialDataState = {
    skip: 0,
    take: 10,
  };
  const [row, setRow] = useState(data);
  const [dataState, setDataState] = React.useState();
  const [collapsedState, setCollapsedState] = React.useState([]);
  const [resultState, setResultState] = React.useState(
    processWithGroups(row, initialDataState)
  );
  //setResultState(process({data}, initialDataState))
  let total = row.length;
  let pageSize = 20;
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

    if (cellProps.rowType === "groupFooter") {

      if (cellProps.field === "cost") {

        return (
          <td aria-colindex={cellProps.columnIndex} role={"gridcell"}>
             {cellProps.dataItem.aggregates.cost.sum.toFixed(2)}
          </td>
        );
      }
      if (cellProps.field === "market") {

        return (
          <td aria-colindex={cellProps.columnIndex} role={"gridcell"}>
             {cellProps.dataItem.aggregates.market.sum.toFixed(2)}
          </td>
        );
      }
      if (cellProps.field === "unrGainLoss") {

        return (
          <td aria-colindex={cellProps.columnIndex} role={"gridcell"}>
             {cellProps.dataItem.aggregates.unrGainLoss.sum.toFixed(2)}
          </td>
        );
      }
      if (cellProps.field === "principalCash") {

        return (
          <td aria-colindex={cellProps.columnIndex} role={"gridcell"}>
             {cellProps.dataItem.aggregates.unrGainLoss.sum.toFixed(2)}
          </td>
        );
      }
      if (cellProps.field === "incomeCash") {

        return (
          <td aria-colindex={cellProps.columnIndex} role={"gridcell"}>
             {cellProps.dataItem.aggregates.unrGainLoss.sum.toFixed(2)}
          </td>
        );
      }
      if (cellProps.field === "investedIncome") {

        return (
          <td aria-colindex={cellProps.columnIndex} role={"gridcell"}>
             {cellProps.dataItem.aggregates.unrGainLoss.sum.toFixed(2)}
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
        {
        
        <div className='card-header row d-flex justify-content-between align-items-center my-2'>

          <div className='col'>
            <p className='tableheader h6'>Account Holding Report</p>
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
        <div className="mx-1 my-1 py-1">
        <ExcelExport data={data} ref={_export}> 
       <Grid style={{ height: "600px" }}
            data={newData}
       
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
           // total={total}
           // filterable={true}
           onDataStateChange={onDataStateChange}
           {...dataState}
           onExpandChange={onExpandChange}
           expandField="expanded"
            cellRender={cellRender}
          >
            
            <Column field="branch" menu={true} title="Branch" width="150px" locked={true} columnMenu={ColumnMenu}/>
            <Column field="accountType" menu={true} title="Account Type" width="150px" locked={true} columnMenu={ColumnMenu}/>
            <Column field="accountName" menu={true} title="Account Name" width="150px"  locked={true} columnMenu={ColumnMenu}/>
            <Column field="asset" menu={true} title="Asset Description" width="150px" columnMenu={ColumnMenu}/>
            <Column field="tckrSymbl" menu={true} title="Ticker" width="150px" columnMenu={ColumnMenu}/>
            <Column field="cusip" menu={true} title="Cusip" width="150px" columnMenu={ColumnMenu}/>
            <Column field="pmrDesc" menu={true} title="PMR" width="150px" columnMenu={ColumnMenu}/>
            <Column field="shares" title="Shares" cell={NumberCell} headerCell={RightNameHeader} format="{0:n2}" width="150px" filter="numeric" filterable={false} />
            <Column field="cost" title="Cost" cell={NumberCell} headerCell={RightNameHeader} width="150px" footerCell={totalSum} format="{0:n2}" filter="numeric" filterable={false}/>
            <Column field="market" title="Market" cell={NumberCell} headerCell={RightNameHeader} width="150px" footerCell={totalSum} format="{0:n2}" filter="numeric" filterable={false}/>

            <Column field="unrGainLoss" title="Unr Gain Loss" cell={NumberCell} headerCell={RightNameHeader} footerCell={totalSum} format="{0:n2}" width="150px" filter="numeric" filterable={false}/>
            <Column field="estAnnInc" title="Est Ann Inc" cell={NumberCell} headerCell={RightNameHeader} format="{0:n2}" width="150px" filter="numeric" filterable={false}/>
            <Column field="yield" title="Yield" cell={NumberCell} headerCell={RightNameHeader} width="150px" format="{0:n2}" filter="numeric" filterable={false}/>
            <Column field="accruedInterest" title="Acc Int" cell={NumberCell} headerCell={RightNameHeader} format="{0:n2}" width="150px" filter="numeric" filterable={false}/>
            <Column field="principalCash" title="PCash" cell={NumberCell} headerCell={RightNameHeader} width="150px" footerCell={totalSum} format="{0:n2}" filter="numeric" filterable={false}/>
            <Column field="incomeCash" title="ICash" cell={NumberCell} headerCell={RightNameHeader} width="150px" footerCell={totalSum} format="{0:n2}" filter="numeric" filterable={false}/>
            <Column field="investedIncome" title="Invested Income" cell={NumberCell} headerCell={RightNameHeader} footerCell={totalSum} format="{0:n2}" width="150px" filter="numeric" filterable={false}/>
            <Column field="investmentObjective" title="Inv Objective" width="150px" filter="numeric" filterable={false}/>
            <Column field="administrator" title="Administrator" width="150px" />
            <Column field="investmentOfficer" title="Inv Officer" width="150px" />
            <Column field="rate" title="Rate" cell={NumberCell} headerCell={RightNameHeader} format="{0:n2}" filter="numeric" filterable={false} width="150px" />
            <Column field="txCstAmt" title="Tax Cost" cell={NumberCell} headerCell={RightNameHeader} format="{0:n2}" filter="numeric" filterable={false} width="150px" />
            <Column field="yldToCost" title="Yeild To Cost" cell={NumberCell} headerCell={RightNameHeader} format="{0:n2}" filter="numeric" filterable={false} width="150px" />

           
          </Grid>
          </ExcelExport> 
          </div>
          </div>
    </div>
  )
}

export default AcctHoldingGrid


