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
  // {
  //   field: "shares",
  //   aggregate: "sum",
  // },
  // {
  //   field: "market",
  //   aggregate: "sum",
  // },
  // {
  //   field: "yield",
  //   aggregate: "average",
  // },
  // {
  //   field: "yldToMtrty",
  //   aggregate: "average",
  // },
  // {
  //   field: "yldCalPut",
  //   aggregate: "average",
  // },
  // {
  //   field: "duration",
  //   aggregate: "average",
  // },
  // {
  //   field: "calPutDuration",
  //   aggregate: "average",
  // }
];

const initialGroup = [
  {
    field: "accountNumber",
    field: "mtrtyYr",
  }
];

const processWithGroups = (data, dataState) => {
  // debugger;
  const groups = dataState.group;

  // if (groups) {
  //   groups.map((group) => (group.aggregates = aggregates));
  // }

  dataState.group = groups;
  const newDataState = process(data, dataState);
  setGroupIds({
    data: newDataState.data,
    group: dataState.group,
  });
  return newDataState;
};

const FixdIncmFundmntlsGrid = ({data}) => {
  const _export = React.useRef(null);
  const excelExport = () => {
    if (_export.current !== null) {
      _export.current.save(data);
    }
  };
  
  const clearFIGrid = () => {
    let FiIntData=JSON.parse(localStorage.getItem("FIInitialData"));
    setResult(processWithGroups(FiIntData, dataState));
    setSelectedData(FiIntData);
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
      field: 'accountNumber',
      minWidth: 150,
      show: true,
      filter: 'text',
      locked: true,
    },
    {
      title: 'Account Name',
      field: 'accountName',
      minWidth: 170,
      show: true,
      filter: 'text',
      locked: true,
    },
    {
      title: 'Maturity Year',
      field: 'mtrtyYr',
      minWidth: 140,
      show: true,
      filter: 'numeric',
      locked: true,      
      headerCell:RightNameHeader, 
    },
    {
      title: 'Description',
      field: 'astShrtNm',
      minWidth: 300,
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
      headerCell:RightNameHeader,  
    },
    {
      title: 'Market($)',
      field: 'market',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
      headerCell:RightNameHeader,
    },
    {
      title: 'YTM%',
      field: 'yldToMtrty',
      minWidth: 100,
      show: true,
      filter: 'numeric',
      locked: false,
      headerCell:RightNameHeader,
    },
    {
      title: 'Duration To Maturity',
      field: 'duration',
      minWidth: 160,
      show: true,
      filter: 'numeric',
      locked: false,
      headerCell:RightNameHeader,
    },
    {
      title: 'Current Yield%',
      field: 'yield',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
      headerCell:RightNameHeader,
    },
    {
      title: 'Moody Rating',
      field: 'moodyRating',
      minWidth: 150,
      show: true,
      filter: 'text',
      locked: false,
    },
    {
      title: 'SP Rating',
      field: 'spRating',
      minWidth: 150,
      show: true,
      filter: 'text',
      locked: false,
    }
  ];

  const columns1 = [
    {
      title: 'Account Number',
      field: 'accountNumber',
      minWidth: 150,
      show: true,
      filter: 'text',
      locked: true,
    },
    {
      title: 'Account Name',
      field: 'accountName',
      minWidth: 170,
      show: true,
      filter: 'text',
      locked: true,
    },
    {
      title: 'Maturity Year',
      field: 'mtrtyYr',
      minWidth: 140,
      show: true,
      filter: 'numeric',
      locked: true,
      headerCell:RightNameHeader, 
    },
    {
      title: 'Description',
      field: 'astShrtNm',
      minWidth: 300,
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
      headerCell:RightNameHeader,   
    },
    {
      title: 'Market($)',
      field: 'market',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
      headerCell:RightNameHeader,
    },
    {
      title: 'YTM%',
      field: 'yldToMtrty',
      minWidth: 100,
      show: true,
      filter: 'numeric',
      locked: false,
      headerCell:RightNameHeader,
    },
    {
      title: 'YTW%',
      field: 'yldCalPut',
      minWidth: 100,
      show: true,
      filter: 'numeric',
      locked: false,
      headerCell:RightNameHeader,
    },
    {
      title: 'Duration To Maturity',
      field: 'duration',
      minWidth: 160,
      show: true,
      filter: 'numeric',
      locked: false,
      headerCell:RightNameHeader,
    },
    {
      title: 'Duration To Call/Put',
      field: 'calPutDuration',
      minWidth: 160,
      show: true,
      filter: 'numeric',
      locked: false,
      headerCell:RightNameHeader,
    },
    {
      title: 'Current Yield%',
      field: 'yield',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
      headerCell:RightNameHeader,     
    },
    {
      title: 'Moody Rating',
      field: 'moodyRating',
      minWidth: 150,
      show: true,
      filter: 'text',
      locked: false,
    },
    {
      title: 'SP Rating',
      field: 'spRating',
      minWidth: 150,
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
    sort: [{ field: 'mtrtyYr', dir: 'asc' }],
  });

  const [result, setResult] = React.useState(
    processWithGroups(data, initialState.dataState)
  );

  const [dataState, setDataState] = React.useState(initialState.dataState);
  const [stateColumns, setStateColumns] = React.useState(columns);
  const [currentColumns, setCurrentColumns] = React.useState(columns);
  const [ChkBoxState, setChkBoxState] = useState(false);
  const [chartData, setSelectedData] = React.useState(data);
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

  const cellRender = (tdElement, cellProps) => {    
    
    
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

    if(cellProps.field==="yldToMtrty")
      {
        return (          
          <td aria-colindex={cellProps.columnIndex} style={{ textAlign: 'right' }} role={"gridcell"}>
            { formatNumber(cellProps.dataItem["yldToMtrty"], "##,#.00")}
          </td>          
      );
      }
      if(cellProps.field==="yldCalPut")
      {
        return (
          (ChkBoxState===true)?
          <>
          <td aria-colindex={cellProps.columnIndex} style={{ textAlign: 'right' }} role={"gridcell"}>
            { formatNumber(cellProps.dataItem["yldCalPut"], "##,#.00")}
          </td>
          </>:
          <>
          </>
      );
      }
      if(cellProps.field==="duration")
      {
        return (          
          <td aria-colindex={cellProps.columnIndex} style={{ textAlign: 'right' }} role={"gridcell"}>
            { formatNumber(cellProps.dataItem["duration"], "##,#.00")}
          </td>
      );
      }
      if(cellProps.field==="calPutDuration")
      {
        return (
          (ChkBoxState===true)?
          <>
          <td aria-colindex={cellProps.columnIndex} style={{ textAlign: 'right' }} role={"gridcell"}>
            { formatNumber(cellProps.dataItem["calPutDuration"], "##,#.00")}
          </td>
          </>:
          <>
          </>
      );
      }
      if (cellProps.field === "yield") {

        return (
          <td aria-colindex={cellProps.columnIndex} style={{ textAlign: 'right' }} role={"gridcell"}>
            { formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
          </td>
        );
      }
    
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

    return tdElement;
  };

  const ShowMaturityCallPut = (e) => {
    ;
    setChkBoxState(e.target.checked);
    if (e.target.checked) {
      setCurrentColumns(columns1);
      setStateColumns(columns1);
    }
    else {
      setCurrentColumns(columns);
      setStateColumns(columns);
    }
    // debugger;
    // let updatedState = createDataState(dataState);

    setResult(processWithGroups(data, dataState));

    setDataState(dataState);
      
  };
  const labelContent = (e) => `$${formatNumber(e.value, "##,#.00")}`;
  const FormatLongNumber=({value})=> {
       
    if(value === 0) {
      return 0;
    }
    else
    {
          // for testing
        //value = Math.floor(Math.random()*1001);
   
        // hundreds
        if(value <= 999){
          return value;
        }
        // thousands
        else if(value >= 1000 && value <= 999999){
          return (value / 1000) + 'K';
        }
        // millions
        else if(value >= 1000000 && value <= 999999999){
          return (value / 1000000) + 'M';
        }
        // billions
        else if(value >= 1000000000 && value <= 999999999999){
          return (value / 1000000000) + 'B';
        }
        else
          return value;
    }
  }
  const onRowClick = e => {
    //debugger;
     var actId = e.dataItem.acctId;
 
     var acctData = Enumerable.from(data).where(w => w.acctId === actId)
         .toArray();
 
     setSelectedData(acctData);
     
     setResult(processWithGroups(data,dataState));
     setDataState(dataState);
 };

  return (
    <div>
      <div className="card-header row d-flex justify-content-between align-items-center my-2">
        <div className="col">
          <p className="tableheader h6">Fixed Income Fundamentals Report</p>
        </div>
        <div className="col"></div>
        <div className="col">
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={excelExport}
          >
            Export to Excel
          </button>&nbsp;
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={clearFIGrid}
          >
            Clear Selection
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
              onRowClick={onRowClick}
            >
              <GridToolbar>
                <FormGroup>
                  <FormControlLabel control={<Checkbox name='chkShwMtrtyCall' onChange={ShowMaturityCallPut} />} label="Duration to Call" />
                </FormGroup>
              </GridToolbar>
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
        <div className="mx-1 px-1 my-1 py-1 card-body border">
        <Chart style={{ height: "400px" }}>
                                        {/* <ChartTitle text="Maturity Date Vs Call/Put Date" /> */}
                                        <ChartLegend position="bottom" />
                                        <ChartCategoryAxis>
                                            <ChartCategoryAxisItem
                                                labels={{
                                                    visible: true,
                                                    rotation: 85,
                                                    format: "d",
                                                }}
                                            />
                                        </ChartCategoryAxis>
                                        <ChartValueAxis>
                                        <ChartValueAxisItem                                           
                                            min={0}
                                            max={1000000}
                                           labels={{
                                            visible: true,
                                           content:FormatLongNumber,  
                                           padding:35,                        
                                        }}
                                        />
                                    </ChartValueAxis>
                                        <ChartSeries>
                                            <ChartSeriesItem
                                                type="area"
                                                min={5}
                                                data={chartData}
                                                field="market"
                                                categoryField="mtrtyYr"
                                                name='Market Value'
                                                labels={{
                                                    visible: true,
                                                    content: labelContent,
                                                }}
                                            />
                                        </ChartSeries>
                                    </Chart>
                                    </div>
      </div>
      <br />
    </div>
  );
};

export default FixdIncmFundmntlsGrid
