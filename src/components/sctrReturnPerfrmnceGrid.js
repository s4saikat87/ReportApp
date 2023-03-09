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
  GridGroupCell,
  GridToolbar,
} from '@progress/kendo-react-grid';

import {
  setGroupIds,
  getGroupIds,
  setExpandedState,
} from '@progress/kendo-react-data-tools';
import {
  Sparkline,
  Chart,
  ChartSeries,
  ChartSeriesItem,
  ChartAxisDefaults,
  ChartCategoryAxis,
  ChartSeriesDefaults,
  ChartCategoryAxisItem,
  ChartTitle,
  ChartLegend,
  LegendItemClickEvent,
  ChartValueAxis,
  ChartValueAxisItem,
  ChartTooltip,
} from "@progress/kendo-react-charts";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Moment from 'react-moment';
import Enumerable from 'linq';
import "hammerjs";

const aggregates = [
  {
    field: "initialVal",
    aggregate: "sum",
  },
  {
    field: "income",
    aggregate: "sum",
  },
  {
    field: "netFlows",
    aggregate: "sum",
  },
  {
    field: "endingVal",
    aggregate: "sum",
  },
  {
    field: "weightVal",
    aggregate: "sum",
  },
  {
    field: "gainLoss",
    aggregate: "sum",
  }
];

const initialGroup = [
  {
    field: "accountNumber",
  }
];

const processWithGroups = (data, dataState) => {
  // debugger;
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

const SctrReturnPerformanceGrid = ({data}) => {
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

  const RightNameHeader = (props) => {
    return (
        <a className="k-link" style={{
          float: "right",
      }}  onClick={props.onClick}>
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
      title: 'Account Number',
      field: 'extrnlAcctId',
      minWidth: 150,
      show: true,
      filter: 'text',
      locked: true,
    },
    {
      title: 'Account Name',
      field: 'shrtNm',
      minWidth: 170,
      show: true,
      filter: 'text',
      locked: false,
    },
    {
      title: 'Performance Template',
      field: 'perfTmpltNm',
      minWidth: 170,
      show: true,
      filter: 'text',
      locked: false,      
      headerCell:RightNameHeader, 
    },
    {
      title: 'Return',
      field: 'retVal',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
    },
    {
      title: 'Initial Value',
      field: 'initialVal',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
      headerCell:RightNameHeader,  
    },
    {
      title: 'Income',
      field: 'income',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
      headerCell:RightNameHeader,
    },
    {
      title: 'Net Flows',
      field: 'netFlows',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
      headerCell:RightNameHeader,
    },
    {
      title: 'Ending Value',
      field: 'endingVal',
      minWidth: 160,
      show: true,
      filter: 'numeric',
      locked: false,
      headerCell:RightNameHeader,
    },
    {
      title: 'Weight',
      field: 'weightVal',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
      headerCell:RightNameHeader,
    },
    {
      title: 'Gain/Loss',
      field: 'gainLoss',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
    },
    {
      title: 'Rank',
      field: 'rankVal',
      minWidth: 80,
      show: true,
      filter: 'text',
      locked: false,
    }
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
    sort: [{ field: 'extrnlAcctId', dir: 'asc' }],
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
          <td  style={{ textAlign: 'right' }} >
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
        { field: 'extrnlAcctId' },
        { field: 'shrtNm' },
        { field: 'perfTmpltNm' },
        { field: 'retVal'},

        { field: 'initialVal', aggregate: 'sum'},
        { field: 'income', aggregate: 'sum'},
        { field: 'netFlows', aggregate: 'sum'},        
        { field: 'endingVal', aggregate: 'sum'},
        { field: 'weightVal', aggregate: 'sum'},
        { field: 'gainLoss', aggregate: 'sum'}, 

        { field: 'rankVal'},
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
    if (cellProps.rowType === "data")
    {
    let cpnRate="", matrtyDate="";

    // if(cellProps.field==="mtrtyYr")
    // {
    //   return (
    //     <td aria-colindex={cellProps.columnIndex} className={'right-align'} role={"gridcell"}>
    //        { formatNumber(cellProps.dataItem[cellProps.field], "###")}
    //     </td>
    // );
    // }

    if(cellProps.field==="retVal")
      {
        return (
         
          <td aria-colindex={cellProps.columnIndex} style={{ textAlign: 'right' }}  role={"gridcell"}>
            { formatNumber(cellProps.dataItem[cellProps.field], "##,#.000000")}
          </td>
      );
      }
    
    if(cellProps.field==="initialVal")
      {
        return (
          
          <td aria-colindex={cellProps.columnIndex} style={{ textAlign: 'right' }}  role={"gridcell"}>
            { formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
          </td>          
      );
      }

    if(cellProps.field==="income")
      {
        return (          
          <td aria-colindex={cellProps.columnIndex} style={{ textAlign: 'right' }} role={"gridcell"}>
            { formatNumber(cellProps.dataItem["income"], "##,#.00")}
          </td>          
      );
      }
      if(cellProps.field==="netFlows")
      {
        return (
          
          <td aria-colindex={cellProps.columnIndex} style={{ textAlign: 'right' }} role={"gridcell"}>
            { formatNumber(cellProps.dataItem["netFlows"], "##,#.00")}
          </td>
      );
      }
      if(cellProps.field==="endingVal")
      {
        return (          
          <td aria-colindex={cellProps.columnIndex} style={{ textAlign: 'right' }} role={"gridcell"}>
            { formatNumber(cellProps.dataItem["endingVal"], "##,#.00")}
          </td>
      );
      }
      if(cellProps.field==="weightVal")
      {
        return (
          
          <td aria-colindex={cellProps.columnIndex} style={{ textAlign: 'right' }} role={"gridcell"}>
            { formatNumber(cellProps.dataItem["weightVal"], "##,#.00")}
          </td>
      );
      }
      if (cellProps.field === "gainLoss") {

        return (
          <td aria-colindex={cellProps.columnIndex} style={{ textAlign: 'right' }} role={"gridcell"}>
            { formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
          </td>
        );
      }
      if (cellProps.field === "rankVal") {

        return (
          <td aria-colindex={cellProps.columnIndex} style={{ textAlign: 'right' }} role={"gridcell"}>
            { formatNumber(cellProps.dataItem[cellProps.field], "###")}
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
          <p className="tableheader h6">Performance Sector Returns Report</p>
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
              sortable={true}
              resizable={true}
              pageable={true}
              pageSize={20}
              // skip={page.skip}
              // pageable={{
              //   pageSizes: true,
              // }}
              // pageSize={page.take}
              // total={data.length}
              groupable={{
                footer: 'visible',
              }}
              cellRender={cellRender}
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
                      // cell={NumberCell}
                      headerCell={column.headerCell}
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

export default SctrReturnPerformanceGrid
