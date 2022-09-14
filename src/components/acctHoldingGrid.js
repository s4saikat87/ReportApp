import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Grid, GridColumn as Column, GridToolbar } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";

import { ExcelExport } from '@progress/kendo-react-excel-export';
import { formatNumber, formatDate } from '@telerik/kendo-intl';
import { CustomColumnMenu } from './customColumnMenu';

import {
  setGroupIds,
  getGroupIds,
  setExpandedState,
} from '@progress/kendo-react-data-tools';
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
  const groups = dataState.group;

  if (groups) {
    groups.map((group) => (group.aggregates = aggregates));
  }

  dataState.group = groups;
  const newDataState = process(data, dataState);
  setGroupIds({
    data: newDataState.data,
    group: dataState.group,
  });
  return newDataState;
};

const AcctHoldingGrid = ({data}) => {
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
    const field = props.field || '';
    const total = data
      .reduce((acc, current) => acc + current[field], 0)
      .toFixed(2);
    return (
      <td colSpan={props.colSpan} style={props.style}>
        {formatNumber(total, '##,#.00')}
      </td>
    );
  };

  const columns = [
    {
      title: 'Branch',
      field: 'branch',
      minWidth: 150,
      show: true,
      filter: 'text',
      locked: true,
    },
    {
      title: 'Acct. Type',
      field: 'accountType',
      minWidth: 150,
      show: true,
      filter: 'text',
      locked: true,
    },
    {
      title: 'Account#',
      field: 'accountName',
      minWidth: 150,
      show: true,
      filter: 'text',
      locked: true,
    },
    {
      title: 'Description',
      field: 'asset',
      minWidth: 150,
      show: true,
      filter: 'text',
      locked: false,
    },
    {
      title: 'Ticker',
      field: 'tckrSymbl',
      minWidth: 150,
      show: true,
      filter: 'text',
      locked: false,
    },
    {
      title: 'Cusip',
      field: 'cusip',
      minWidth: 180,
      show: true,
      filter: 'text',
      locked: false,
    },
    {
      title: 'PMR',
      field: 'pmrDesc',
      minWidth: 150,
      show: true,
      filter: 'text',
      locked: false,
    },
    {
      title: 'Shares',
      field: 'shares',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
      
    },
    {
      title: 'Cost',
      field: 'cost',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
      footerCell: totalSum ,
    },
    {
      title: 'Market',
      field: 'market',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
      footerCell:  totalSum ,
    },
    {
      title: 'Unr Gain Loss',
      field: 'unrGainLoss',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
      footerCell:  totalSum ,
    },
    {
      title: 'Est Ann Inc',
      field: 'estAnnInc',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
      footerCell:  totalSum ,
    },
    {
      title: 'Yield',
      field: 'yield',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
      footerCell:  totalSum ,
    },
    {
      title: 'Acc Int.',
      field: 'accruedInterest',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
      footerCell:  totalSum ,
    },
    {
      title: 'PCash',
      field: 'principalCash',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
      footerCell:  totalSum ,
    },
    {
      title: 'ICash',
      field: 'incomeCash',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
      footerCell:  totalSum ,
    },
    {
      title: 'Inv. Income',
      field: 'investedIncome',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
      footerCell:  totalSum ,
    },
    {
      title: 'Inv. Objective',
      field: 'investmentObjective',
      minWidth: 150,
      show: true,
      filter: 'text',
      locked: false,
      
    },
    {
      title: 'Administrator',
      field: 'administrator',
      minWidth: 180,
      show: true,
      filter: 'text',
      locked: false,
      
    },
    {
      title: 'Inv. Officer',
      field: 'investmentOfficer',
      minWidth: 150,
      show: true,
      filter: 'text',
      locked: false,
      
    },
    {
      title: 'Rate',
      field: 'rate',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
      
    },
    {
      title: 'Tax Cost',
      field: 'txCstAmt',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
      
    },
    {
      title: 'Yield To Cost',
      field: 'yldToCost',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
      
    },
  ];
  const [row, setRow] = useState(data);
  const createDataState = (dataState) => {
    return {
      result: process(data.slice(0), dataState),
      dataState: dataState,
    };
  };
  let initialState = createDataState({
    take: 20,
    skip: 0,
    // group: [
    //   {
    //     field: 'tranTypNm',
    //   },
    // ],
  });

  const [result, setResult] = React.useState(
    processWithGroups(data, initialState.dataState)
  );
  
  const [dataState, setDataState] = React.useState(initialState.dataState);
  const [stateColumns, setStateColumns] = React.useState(columns);
  const [currentColumns, setCurrentColumns] = React.useState(columns);
  let pageSize = 20;
  const [page, setPage] = React.useState({
    skip: 0,
    take: pageSize,
  });
  const dataStateChange = (event) => {
    let updatedState = createDataState(event.dataState);

    setResult(processWithGroups(data, updatedState.dataState));

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
        <Grid
              style={{ height: '500px' }}
              data={result}
              {...dataState}
              onDataStateChange={dataStateChange}
              expandField="expanded"
              onExpandChange={expandChange}
              cellRender={cellRender}
              sortable={true}
              // pageable={true}
              // pageSize={20}
              skip={page.skip}
            pageable={{
              pageSizes: true,
            }}
            pageSize={page.take}
            total={data.length}
              groupable={{
                footer: 'visible',
              }}
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
                      footerCell={column.footerCell}
                      //cell={column.cell}
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
    </div>
  )
}

export default AcctHoldingGrid


