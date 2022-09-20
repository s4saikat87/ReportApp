import React from 'react';
import * as ReactDOM from 'react-dom';
import { useState, useEffect, useRef } from 'react';

import { process } from '@progress/kendo-data-query';
import { ExcelExport } from '@progress/kendo-react-excel-export';
import { formatNumber, formatDate } from '@telerik/kendo-intl';
import { CustomColumnMenu } from './customColumnMenu';
import {
  Grid,
  GridColumn as Column,
  GridToolbar,
} from '@progress/kendo-react-grid';

import {
  setGroupIds,
  getGroupIds,
  setExpandedState,
} from '@progress/kendo-react-data-tools';

const aggregates = [
  // {
  //   field: 'pCash',
  //   aggregate: 'sum',
  // },
  // {
  //   field: 'iCash',
  //   aggregate: 'sum',
  // },
  // {
  //   field: 'shares',
  //   aggregate: 'sum',
  // },
];
const initialGroup = [
  {
    field: 'branchName',
  },
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

const AcctTransactionGrid = ({data}) => {
  //const data = products;
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

  const columns = [
    {
      title: 'Branch',
      field: 'branchName',
      minWidth: 150,
      show: true,
      filter: 'text',
      locked: true,
    },
    {
      title: 'Account',
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
      title: 'Trans Type',
      field: 'tranTypNm',
      minWidth: 150,
      show: true,
      filter: 'text',
      locked: false,
    },
    {
      title: 'Description',
      field: 'totalLine',
      minWidth: 300,
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
      title: 'Principal($)',
      field: 'pCash',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
      
      
    },
    {
      title: 'Income($)',
      field: 'iCash',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
      
    },
    {
      title: 'Shares',
      field: 'shares',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      format:"{0:d6}" ,
      locked: false,
      
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

  
  const getCells = (columns, cellProps) => {
    let cells = [];
    columns.forEach((column) => {
      if (column.aggregate) {
        cells.push(
          <td style={{ textAlign: "right" }}>
            {formatNumber(cellProps.dataItem.aggregates[column.field][column.aggregate], '##,#.000000')}
          </td>
        );
      } else {
        cells.push(<td>&nbsp;</td>);
      }
    });
    return cells;
  };
  // const cellRender = (tdElement, cellProps) => {
  //   if (
  //     cellProps.rowType === 'groupHeader' &&
  //     tdElement &&
  //     tdElement.props.role != 'presentation'
  //   ) {
  //     //IMPORTANT - You need to add collection with the columns and their field name
  //     //you can define the Grid columns outside of the Grid and reuse them here.
  //     const columns = [
  //       { field: 'branchName' },
  //       { field: 'accountType' },
  //       { field: 'accountName' },
  //       { field: 'tranTypNm'},
  //       { field: 'totalLine'},
  //       { field: 'administrator'},
  //       { field: 'investmentOfficer'},
        
  //       { field: 'pCash' },
  //       { field: 'iCash' },
  //       { field: 'shares'},
  //     ];

  //     return (
  //       <>
  //         <td
  //           {...tdElement.props}
  //           colSpan={tdElement.props.colSpan - columns.length}
  //         ></td>
  //         {getCells(columns, cellProps)}
  //       </>
  //     );
  //   }
  //   if (cellProps.rowType === 'groupFooter') {
  //     // if (cellProps.field === 'pCash') {
  //     //   return (
  //     //     <td aria-colindex={cellProps.columnIndex} role={'gridcell'} >
  //     //       {/* {formatNumber(cellProps.dataItem.aggregates.pCash.sum, '##,#.00')} */}
  //     //       {cellProps.dataItem.aggregates.pCash.sum}
          
  //     //     </td>
  //     //   );
  //     // } else if (cellProps.field === 'iCash') {
  //     //   return (
  //     //     <td aria-colindex={cellProps.columnIndex} role={'gridcell'} >
  //     //        {cellProps.dataItem.aggregates.iCash.sum}
  //     //     </td>
  //     //   );
  //     // }
  //     // else if (cellProps.field === 'shares') {
  //     //   return (
  //     //     <td  aria-colindex={cellProps.columnIndex} role={'gridcell'} >
  //     //        {cellProps.dataItem.aggregates.shares.sum}
  //     //     </td>
  //     //   );
  //     // }
  //   }

  //   return tdElement;
  // };
  const NumberCell = (props) => {
    debugger;
    if(props.field==='branchName'){
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
      if(props.field==='tranTypNm'){
        return (
            <td style={{ textAlign: 'left' }}>
                {props.dataItem[props.field]}
            </td>
        )
        }
    if(props.field==='totalLine'){
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
        if(props.field==='pCash'){
          return (
              <td style={{ textAlign: 'right' }}>
                  {formatNumber(props.dataItem[props.field], "##,#.00")}
              </td>
          )
          }
          if(props.field==='iCash'){
            return (
                <td style={{ textAlign: 'right' }}>
                    {formatNumber(props.dataItem[props.field], "##,#.00")}
                </td>
            )
            }
            if(props.field==='shares'){
              return (
                  <td style={{ textAlign: 'right' }}>
                      
                      {formatNumber(props.dataItem[props.field], "##,#.000000")}
                  </td>
              )
              }
              
  }
  const cellRender = (tdElement, cellProps) => {
    debugger;
    
    if (cellProps.rowType === "data") {

      if (cellProps.field === "pCash") {

        return (
          <td style={{ textAlign: 'right' }} aria-colindex={cellProps.columnIndex} role={"gridcell"}>
              {formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
          </td>
        );
      }
      if (cellProps.field === "iCash") {

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

  return (
    <div>
      <div className="card-header row d-flex justify-content-between align-items-center my-2">
        <div className="col">
          <p className="tableheader h6">Account Transactions Report</p>
        </div>
        <div className="col"></div>
        <div className="col">
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={excelExport}
          >
            Export to Excel
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="mx-1 px-1 my-1 py-1">
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
              resizable={true}
              //pageable={true}
              //pageSize={20}
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
                      footerCell={column.footerCell}
                      //cell={NumberCell}
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
  );
};

export default AcctTransactionGrid
