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
  // {
  //   field: "cost",
  //   aggregate: "sum",
  // },
  {
    field: "market",
    aggregate: "sum",
  },
  
  // {
  //   field: "principalCash",
  //   aggregate: "sum",
  // },
  // {
  //   field: "incomeCash",
  //   aggregate: "sum",
  // },
  // {
  //   field: "investedIncome",
  //   aggregate: "sum",
  // }

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
      <td colSpan={props.colSpan} style={{ textAlign: "right" }}>
        {formatNumber(total, '##,#.00')}
      </td>
    );
  };
  const RightNameHeader = (props) => {
    return (
        <a className="k-link" style={{
            textAlign: "center",
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
      headerCell: RightNameHeader,
    },
    {
      title: 'Cost($)',
      field: 'cost',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
      
    },
    {
      title: 'Market($)',
      field: 'market',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
      footerCell:  totalSum ,
    },
    {
      title: 'Unr Gain Loss($)',
      field: 'unrGainLoss',
      minWidth: 180,
      show: true,
      filter: 'numeric',
      locked: false,
      //footerCell:  totalSum ,
    },
    {
      title: 'Est Ann Inc($)',
      field: 'estAnnInc',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
      //footerCell:  totalSum ,
    },
    {
      title: 'Yield(%)',
      field: 'yield',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
      //footerCell:  totalSum ,
    },
    {
      title: 'Acc Int.(%)',
      field: 'accruedInterest',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
      //footerCell:  totalSum ,
    },
    {
      title: 'Principal($)',
      field: 'principalCash',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
      //footerCell:  totalSum ,
    },
    {
      title: 'Income($)',
      field: 'incomeCash',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
     // footerCell:  totalSum ,
    },
    {
      title: 'Inv. Income($)',
      field: 'investedIncome',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
      //footerCell:  totalSum ,
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
      minWidth: 180,
      show: true,
      filter: 'text',
      locked: false,
      
    },
    // {
    //   title: 'Rate',
    //   field: 'rate',
    //   minWidth: 150,
    //   show: true,
    //   filter: 'numeric',
    //   locked: false,
      
    // },
    {
      title: 'Tax Cost($)',
      field: 'txCstAmt',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
      
    },
    {
      title: 'Yield To Cost(%)',
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
    take: 5,
    skip: 0,
    
  });

  const [result, setResult] = React.useState(
    processWithGroups(data, initialState.dataState)
  );
  
  const [dataState, setDataState] = React.useState(initialState.dataState);
  const [stateColumns, setStateColumns] = React.useState(columns);
  const [currentColumns, setCurrentColumns] = React.useState(columns);
  let pageSize = 10;
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

  
  
  

  
  const getCells = (columns, cellProps) => {
    let cells = [];
    columns.forEach((column) => {
      if (column.aggregate) {
        cells.push(
          <td style={{ textAlign: "right" }}>
            {formatNumber(cellProps.dataItem.aggregates[column.field][column.aggregate], '##,#.00')}
          </td>
        );
      } else {
        cells.push(<td>&nbsp;</td>);
      }
    });
    return cells;
  };
  const cellRender = (tdElement, cellProps) => {
    if (
      cellProps.rowType === 'groupHeader' &&
      tdElement &&
      tdElement.props.role != 'presentation'
    ) {
      //IMPORTANT - You need to add collection with the columns and their field name
      //you can define the Grid columns outside of the Grid and reuse them here.
      const columns = [
        { field: 'branch' },
        { field: 'accountType' },
        { field: 'accountName'},
        { field: 'asset'},
        { field: 'tckrSymbl'},
        { field: 'cusip'},
        { field: 'pmrDesc'},
        { field: 'shares'},
               
        { field: 'cost' },
        { field: 'market', aggregate: 'sum' },
        { field: 'unrGainLoss' },
        { field: 'estAnnInc' },
        { field: 'yield' },
        { field: 'accruedInterest' },
        { field: 'principalCash'},
        { field: 'incomeCash' },
        { field: 'investedIncome'},
        { field: 'investmentObjective'},
        { field: 'administrator'},
        { field: 'investmentOfficer'},
        
        { field: 'txCstAmt'},
        { field: 'yldToCost'},
       

      ];

      return (
        <>
          <td
            {...tdElement.props}
            colSpan={tdElement.props.colSpan - columns.length}
          ></td>
          {getCells(columns, cellProps)}
        </>
      );
    }
    if (cellProps.rowType === 'groupFooter') {
     
      if (cellProps.field === "market") {

        return (
          <td aria-colindex={cellProps.columnIndex} role={"gridcell"}>
             {cellProps.dataItem.aggregates.market.sum}
          </td>
        );
      }
      
      
    }
    if (cellProps.rowType === "data") {

      if (cellProps.field === "market") {

        return (
          <td style={{ textAlign: 'right' }} aria-colindex={cellProps.columnIndex} role={"gridcell"}>
              {formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
          </td>
        );
      }
      if (cellProps.field === "unrGainLoss") {

        return (
          <td style={{ textAlign: 'right' }} aria-colindex={cellProps.columnIndex} role={"gridcell"}>
              {formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
          </td>
        );
      }
      if (cellProps.field === "estAnnInc") {

        return (
          <td style={{ textAlign: 'right' }} aria-colindex={cellProps.columnIndex} role={"gridcell"}>
             {formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
          </td>
        );
      }
      if (cellProps.field === "yield") {

        return (
          <td style={{ textAlign: 'right' }} aria-colindex={cellProps.columnIndex} role={"gridcell"}>
             {formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
          </td>
        );
      }
      if (cellProps.field === "yldToCost") {

        return (
          <td style={{ textAlign: 'right' }} aria-colindex={cellProps.columnIndex} role={"gridcell"}>
             {formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
          </td>
        );
      }
      if (cellProps.field === "accruedInterest") {

        return (
          <td style={{ textAlign: 'right' }} aria-colindex={cellProps.columnIndex} role={"gridcell"}>
             {formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
          </td>
        );
      }
      if (cellProps.field === "principalCash") {

        return (
          <td style={{ textAlign: 'right' }} aria-colindex={cellProps.columnIndex} role={"gridcell"}>
             {formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
          </td>
        );
      }
      if (cellProps.field === "incomeCash") {

        return (
          <td style={{ textAlign: 'right' }} aria-colindex={cellProps.columnIndex} role={"gridcell"}>
             {formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
          </td>
        );
      }
      if (cellProps.field === "investedIncome") {

        return (
          <td style={{ textAlign: 'right' }} aria-colindex={cellProps.columnIndex} role={"gridcell"}>
             {formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
          </td>
        );
      }
      if (cellProps.field === "investedIncome") {

        return (
          <td style={{ textAlign: 'right' }} aria-colindex={cellProps.columnIndex} role={"gridcell"}>
             {formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
          </td>
        );
      }
      if (cellProps.field === "cost") {

        return (
          <td style={{ textAlign: 'right' }} aria-colindex={cellProps.columnIndex} role={"gridcell"}>
             {formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
          </td>
        );
      }
      if (cellProps.field === "shares") {

        return (
          <td style={{ textAlign: 'right' }} aria-colindex={cellProps.columnIndex} role={"gridcell"}>
             {formatNumber(cellProps.dataItem[cellProps.field], "##,#.000000")}
          </td>
        );
      }
    }

    return tdElement;
  };

  const NumberCell = (props) => {
    debugger;
    if(props.field==='branch'){
      return (
          <td style={{ textAlign: 'left' }}>
              {props.dataItem[props.field]}
          </td>
      )
      }
    if(props.field==='accountType'){
      return (
          <td style={{ textAlign: 'left' }}>
              {props.dataItem[props.field]}
          </td>
      )
      }
      if(props.field==='accountName'){
        return (
            <td style={{ textAlign: 'left' }}>
                {props.dataItem[props.field]}
            </td>
        )
        }
      if(props.field==='asset'){
        return (
            <td style={{ textAlign: 'left' }}>
                {props.dataItem[props.field]}
            </td>
        )
        }
    if(props.field==='tckrSymbl'){
    return (
        <td style={{ textAlign: 'left' }}>
            {props.dataItem[props.field]}
        </td>
    )
    }
    if(props.field==='cusip'){
      return (
          <td style={{ textAlign: 'left' }}>
              {props.dataItem[props.field]}
          </td>
      )
      }
    if(props.field==='pmrDesc'){
        return (
            <td style={{ textAlign: 'left' }}>
                {props.dataItem[props.field]}
            </td>
        )
      }
    if(props.field==='shares'){
        return (
          <td style={{ textAlign: 'right' }}>
            {formatNumber(props.dataItem[props.field], "##,#.00")}
          </td>
          )
      }
    if(props.field==='cost'){
         return (
            <td style={{ textAlign: 'right' }}>
                {formatNumber(props.dataItem[props.field], "##,#.00")}
            </td>
          )
      }
    if(props.field==='market'){
              return (
                  <td style={{ textAlign: 'right' }}>
                      {formatNumber(props.dataItem[props.field], "##,#.00")}
                  </td>
              )
              }
    if(props.field==='unrGainLoss'){
                return (
                    <td style={{ textAlign: 'right' }}>
                        {formatNumber(props.dataItem[props.field], "##,#.00")}
                    </td>
                )
                }
    if(props.field==='estAnnInc'){
                  return (
                      <td style={{ textAlign: 'right' }}>
                          {formatNumber(props.dataItem[props.field], "##,#.00")}
                      </td>
                  )
                  }
    if(props.field==='yield'){
                    return (
                        <td style={{ textAlign: 'right' }}>
                            {formatNumber(props.dataItem[props.field], "##,#.00")}
                        </td>
                    )
                    }
    if(props.field==='accruedInterest'){
                      return (
                          <td style={{ textAlign: 'right' }}>
                              {formatNumber(props.dataItem[props.field], "##,#.00")}
                          </td>
                      )
                      }
    if(props.field==='principalCash'){
                        return (
                            <td style={{ textAlign: 'right' }}>
                                {formatNumber(props.dataItem[props.field], "##,#.00")}
                            </td>
                        )
                        }
    if(props.field==='incomeCash'){
                          return (
                              <td style={{ textAlign: 'right' }}>
                                  {formatNumber(props.dataItem[props.field], "##,#.00")}
                              </td>
                          )
                          }
    if(props.field==='investedIncome'){
                            return (
                                <td style={{ textAlign: 'right' }}>
                                    {formatNumber(props.dataItem[props.field], "##,#.00")}
                                </td>
                            )
                            }
    if(props.field==='investmentObjective'){
                              return (
                                  <td style={{ textAlign: 'left' }}>
                                      {props.dataItem[props.field]}
                                  </td>
                              )
                              }
    if(props.field==='administrator'){
                                return (
                                    <td style={{ textAlign: 'left' }}>
                                        {props.dataItem[props.field]}
                                    </td>
                                )
                                }
    if(props.field==='investmentOfficer'){
                                  return (
                                      <td style={{ textAlign: 'left' }}>
                                          {props.dataItem[props.field]}
                                      </td>
                                  )
                                  }
    if(props.field==='rate'){
                                    return (
                                        <td style={{ textAlign: 'right' }}>
                                            {formatNumber(props.dataItem[props.field], "##,#.00")}
                                        </td>
                                    )
                                    }
    if(props.field==='txCstAmt'){
                                      return (
                                          <td style={{ textAlign: 'right' }}>
                                              {formatNumber(props.dataItem[props.field], "##,#.00")}
                                          </td>
                                      )
                                      }
     if(props.field==='yldToCost'){
                                        return (
                                            <td style={{ textAlign: 'right' }}>
                                                {formatNumber(props.dataItem[props.field], "##,#.00")}
                                            </td>
                                        )
                                        }
              
  }
  
  return (
    
    <div>
        {
        
        <div className='card-header row d-flex justify-content-between align-items-center my-2'>

          <div className='col'>
            <p className='tableheader h6'>Holding Report</p>
            </div>
            <div className='col'></div>
          
          <div className='col'>
          <button 
          className='btn btn-outline-primary' 
          onClick={excelExport}>Export to Excel</button>

            </div>

        </div>
        /* <div className="card mx-2 my-2">
            <div className="card-header tableheader">Account Transaction Report</div>
        </div> */}
        <div className="card-body">
        <div className="mx-1 my-1 py-1">
        <ExcelExport data={data} ref={_export}> 
        <Grid
              style={{ height: 'auto' }}
              data={result}
              {...dataState}
              onDataStateChange={dataStateChange}
              expandField="expanded"
              onExpandChange={expandChange}
              cellRender={cellRender}
              sortable={true}
              resizable={true}
              pageable={true}
              pageSize={10}

            
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
                      //headerCell={column.headerCell}
                      //cell={NumberCell}
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


