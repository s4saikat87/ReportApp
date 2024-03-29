import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Grid, GridColumn as Column, GridToolbar } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import { ExcelExport } from '@progress/kendo-react-excel-export';
import Moment from 'react-moment';
import { formatNumber, formatDate  } from '@telerik/kendo-intl';

import { CustomColumnMenu } from './customColumnMenu';
import {
  setGroupIds,
  getGroupIds,
  setExpandedState,
} from "@progress/kendo-react-data-tools";
import { textAlign } from '@mui/system';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
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
import Enumerable from 'linq';

const aggregates = [
    {
      field: "startMarket",
      aggregate: "sum",
    },
    {
      field: "receipt",
      aggregate: "sum",
    },
    {
      field: "disbursement",
      aggregate: "sum",
    },
    {
        field: "income",
        aggregate: "sum",
    },
    {
      field: "rlGainLoss",
      aggregate: "sum",
  },
  {
    field: "ulGainLoss",
    aggregate: "sum",
},
    {
        field: "endMarket",
        aggregate: "sum",
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
const AcctPerfRptGrid = ({data, alloc, ror}) => {
    //debugger;
    const _export = React.useRef(null);
    const _exportRor = React.useRef(null);
  const excelExport = () => {
    if (_export.current !== null && _exportRor !== null) {
      _export.current.save(data);
      _exportRor.current.save(ror);
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
      <td colSpan={props.colSpan} style={{textAlign : 'right'}}>
        {formatNumber(total, '##,#.00')}
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
const NumberCell = (props) => {
  debugger;
  if(props.field==='extrnlAcctId'){
    return (
        <td style={{ textAlign: 'left' }}>
            {props.dataItem[props.field]}
        </td>
    )
    }
    if(props.field==='shrtNm'){
      return (
          <td style={{ textAlign: 'left' }}>
              {props.dataItem[props.field]}
          </td>
      )
      }
  if(props.field==='startMarket'){
  return (
      <td style={{ textAlign: 'right' }}>
          {formatNumber(props.dataItem[props.field], "##,#.00")}
      </td>
  )
  }
  if(props.field==='receipt'){
    return (
        <td style={{ textAlign: 'right' }}>
            {formatNumber(props.dataItem[props.field], "##,#.00")}
        </td>
    )
    }
    if(props.field==='disbursement'){
      return (
          <td style={{ textAlign: 'right' }}>
              {formatNumber(props.dataItem[props.field], "##,#.00")}
          </td>
      )
      }
      if(props.field==='income'){
        return (
            <td style={{ textAlign: 'right' }}>
                {formatNumber(props.dataItem[props.field], "##,#.00")}
            </td>
        )
        }
        if(props.field==='rlGainLoss'){
          return (
              <td style={{ textAlign: 'right' }}>
                  {formatNumber(props.dataItem[props.field], "##,#.00")}
              </td>
          )
          }
          if(props.field==='ulGainLoss'){
            return (
                <td style={{ textAlign: 'right' }}>
                    {formatNumber(props.dataItem[props.field], "##,#.00")}
                </td>
            )
            }
            if(props.field==='endMarket'){
              return (
                  <td style={{ textAlign: 'right' }}>
                      {formatNumber(props.dataItem[props.field], "##,#.00")}
                  </td>
              )
              }
}
  const columns = [
    {
      title: 'Acct. Number',
      field: 'extrnlAcctId',
      minWidth: 180,
      show: true,
      filter: 'text',
      locked: true,
    },
    {
      title: 'Account#',
      field: 'shrtNm',
      minWidth: 200,
      show: true,
      filter: 'text',
      locked: true,
    },
    {
      title: 'Start Market',
      field: 'startMarket',
      minWidth: 180,
      show: true,
      filter: 'numeric',
      
      footerCell:  totalSum ,
    },
    {
      title: 'Admin Receipts',
      field: 'receipt',
      minWidth: 180,
      show: true,
      filter: 'numeric',
      locked: false,
      footerCell:  totalSum ,
    },
    {
      title: 'Disbursement',
      field: 'disbursement',
      minWidth: 180,
      show: true,
      filter: 'numeric',
      locked: false,
      footerCell:  totalSum ,
    },
    {
      title: 'Earned Income',
      field: 'income',
      minWidth: 180,
      show: true,
      filter: 'numeric',
      locked: false,
      footerCell:  totalSum ,
    },
    {
      title: 'Realized Gain/Loss',
      field: 'rlGainLoss',
      minWidth: 200,
      show: true,
      filter: 'numeric',
      locked: false,
      footerCell:  totalSum ,
    },
    {
      title: 'Unrealized Gain/Loss',
      field: 'ulGainLoss',
      minWidth: 200,
      show: true,
      filter: 'numeric',
      locked: false,
      footerCell:  totalSum ,
    },
    {
      title: 'End Market',
      field: 'endMarket',
      minWidth: 180,
      show: true,
      filter: 'numeric',
      locked: false,
      footerCell:  totalSum ,
    },
    
  ];

  const columnsRor = [
    {
      title: 'Account Number',
      field: 'extrnlAcctId',
      minWidth: 180,
      show: true,
      filter: 'text',
      locked: true,
    },
    {
      title: 'Account Name',
      field: 'shrtNm',
      minWidth: 200,
      show: true,
      filter: 'text',
      locked: true,
    },
    {
      title: 'Investment Objective',
      field: 'iobNm',
      minWidth: 300,
      show: true,
      filter: 'text',
      locked: true,
      
    },
    {
      title: 'Month to Date',
      field: 'monthToDate',
      minWidth: 180,
      show: true,
      filter: 'numeric',
      locked: false,
    },
    {
      title: 'Quarter to Date',
      field: 'quarterToDate',
      minWidth: 180,
      show: true,
      filter: 'numeric',
      locked: false,
    },
    {
      title: 'Year to Date',
      field: 'yearToDate',
      minWidth: 180,
      show: true,
      filter: 'numeric',
      locked: false,
    },
    {
      title: 'Last 1 year',
      field: 'oneYear',
      minWidth: 180,
      show: true,
      filter: 'numeric',
      locked: false,
    },
    {
      title: 'Last 3 years',
      field: 'threeYear',
      minWidth: 180,
      show: true,
      filter: 'numeric',
      locked: false,
    },
    {
      title: 'Last 5 years',
      field: 'fiveYear',
      minWidth: 180,
      show: true,
      filter: 'numeric',
      locked: false,
    },
    {
      title: 'Last 10 years',
      field: 'tenYear',
      minWidth: 180,
      show: true,
      filter: 'numeric',
      locked: false,
    },
    {
      title: 'Since inception',
      field: 'inception',
      minWidth: 180,
      show: true,
      filter: 'numeric',
      locked: false,
    },

    
  ];

  const [row, setRow] = useState(data);
  const [rowRor, setRowRor] = useState(ror);

  const createDataState = (dataState) => {
    return {
      result: process(data.slice(0), dataState),
      dataState: dataState,
    };
  };

  const createDataStateRor = (dataState) => {
    return {
      result: process(ror.slice(0), dataState),
      dataState: dataState,
    };
  };

  let initialState = createDataState({
    take: 20,
    skip: 0,
    // group: [
    //   {
    //     field: 'accountName',
    //   },
    // ],
  });

  let initialStateRor = createDataStateRor({
    take: 20,
    skip: 0,
    // group: [
    //   {
    //     field: 'accountName',
    //   },
    // ],
  });

  const [result, setResult] = React.useState(
    processWithGroups(data, initialState.dataState)
  );

  const [resultRor, setResultRor] = React.useState(
    processWithGroups(ror, initialStateRor.dataState)
  );
  
  const [dataState, setDataState] = React.useState(initialState.dataState);
  const [stateColumns, setStateColumns] = React.useState(columns);
  const [currentColumns, setCurrentColumns] = React.useState(columns);

  const [dataStateRor, setDataStateRor] = React.useState(initialStateRor.dataState);
  const [stateColumnsRor, setStateColumnsRor] = React.useState(columnsRor);
  const [currentColumnsRor, setCurrentColumnsRor] = React.useState(columnsRor);

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

  const dataStateChangeRor = (event) => {
    let updatedStateRor = createDataStateRor(event.dataState);

    setResultRor(processWithGroups(ror, updatedStateRor.dataState));

    setDataStateRor(updatedStateRor.dataState);
  };


  const onColumnsSubmit = (columnsState) => {
    setStateColumns(columnsState);
  };

  const onColumnsSubmitRor = (columnsState) => {
    setStateColumnsRor(columnsState);
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
    setResultRor({ ...resultRor });
  };

  const expandChangeRor = (event) => {
    const isExpanded =
      event.dataItem.expanded === undefined
        ? event.dataItem.aggregates
        : event.dataItem.expanded;
    event.dataItem.expanded = !isExpanded;
    setResultRor({ ...resultRor });
  };

  const getCells = (columns, cellProps) => {
    let cells = [];
    columns.forEach((column) => {
      if (column.aggregate) {
        cells.push(
          <td>
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
        { field: 'startMarket', aggregate: 'sum' },
        { field: 'receipt', aggregate: 'sum'},
        { field: 'disbursement', aggregate: 'sum'},
        { field: 'income', aggregate: 'sum' },        
        { field: 'rlGainLoss', aggregate: 'sum' },
        { field: 'ulGainLoss', aggregate: 'sum' },
        { field: 'endMarket', aggregate: 'sum' },
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
      if (cellProps.field === 'startMarket') {
        return (
          <td style={{ textAlign: 'right' }} aria-colindex={cellProps.columnIndex} role={'gridcell'}>
            {/* {formatNumber(cellProps.dataItem.aggregates.pCash.sum, '##,#.00')} */}
            {cellProps.dataItem.aggregates.startMarket.sum}
          
          </td>
        );
        
      } else if (cellProps.field === 'receipt') {
        return (
          <td aria-colindex={cellProps.columnIndex} role={'gridcell'}>
             {cellProps.dataItem.aggregates.receipt.sum}
          </td>
        );
      }else if (cellProps.field === 'disbursement') {
        return (
          <td aria-colindex={cellProps.columnIndex} role={'gridcell'}>
             {cellProps.dataItem.aggregates.disbursement.sum}
          </td>
        );
      }
      else if (cellProps.field === 'income') {
        return (
          <td aria-colindex={cellProps.columnIndex} role={'gridcell'}>
             {cellProps.dataItem.aggregates.income.sum}
          </td>
        );
      }
      else if (cellProps.field === 'rlGainLoss') {
        return (
          <td aria-colindex={cellProps.columnIndex} role={'gridcell'}>
             {cellProps.dataItem.aggregates.rlGainLoss.sum}
          </td>
        );
      }
      else if (cellProps.field === 'ulGainLoss') {
        return (
          <td aria-colindex={cellProps.columnIndex} role={'gridcell'}>
             {cellProps.dataItem.aggregates.ulGainLoss.sum}
          </td>
        );
      }
      else if (cellProps.field === 'endMarket') {
        return (
          <td aria-colindex={cellProps.columnIndex} role={'gridcell'}>
             {cellProps.dataItem.aggregates.endMarket.sum}
          </td>
        );
      }
    }

    if (cellProps.rowType === 'data') {
      if (cellProps.field === 'startMarket') {
        return (
          <td style={{ textAlign: 'right' }} aria-colindex={cellProps.columnIndex} role={'gridcell'}>
            {/* {formatNumber(cellProps.dataItem.aggregates.pCash.sum, '##,#.00')} */}
            { formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
          
          </td>
        );
        
      } else if (cellProps.field === 'receipt') {
        return (
          <td style={{ textAlign: 'right' }} aria-colindex={cellProps.columnIndex} role={'gridcell'}>
             { formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
          </td>
        );
      }else if (cellProps.field === 'disbursement') {
        return (
          <td style={{ textAlign: 'right' }} aria-colindex={cellProps.columnIndex} role={'gridcell'}>
             { formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
          </td>
        );
      }
      else if (cellProps.field === 'income') {
        return (
          <td style={{ textAlign: 'right' }} aria-colindex={cellProps.columnIndex} role={'gridcell'}>
             { formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
          </td>
        );
      }
      else if (cellProps.field === 'rlGainLoss') {
        return (
          <td style={{ textAlign: 'right' }} aria-colindex={cellProps.columnIndex} role={'gridcell'}>
             { formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
          </td>
        );
      }
      else if (cellProps.field === 'ulGainLoss') {
        return (
          <td style={{ textAlign: 'right' }} aria-colindex={cellProps.columnIndex} role={'gridcell'}>
             { formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
          </td>
        );
      }
      else if (cellProps.field === 'endMarket') {
        return (
          <td style={{ textAlign: 'right' }} aria-colindex={cellProps.columnIndex} role={'gridcell'}>
             { formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
          </td>
        );
      }
    }

    return tdElement;
  };

  const cellRenderRor = (tdElement, cellProps) => {
    if (
      cellProps.rowType === 'groupHeader' &&
      tdElement &&
      tdElement.props.role != 'presentation'
    ) {
      //IMPORTANT - You need to add collection with the columns and their field name
      //you can define the Grid columns outside of the Grid and reuse them here.
      const columnsRor = [
        { field: 'extrnlAcctId' },
        { field: 'shrtNm' },
        { field: 'iobNm' },
        { field: 'monthToDate'},
        { field: 'quarterToDate'},
        { field: 'yearToDate'},        
        { field: 'oneYear' },
        { field: 'threeYear' },
        { field: 'fiveYear' },
        { field: 'tenYear' },
        { field: 'inception' },
      ];

      return (
        <>
          <td
            {...tdElement.props}
            colSpan={tdElement.props.colSpan - columnsRor.length}
          ></td>
          {getCells(columnsRor, cellProps)}
        </>
      );
    }
    

    if (cellProps.rowType === 'data') {
      if (cellProps.field === 'monthToDate') {
        return (
          <td style={{ textAlign: 'right' }} aria-colindex={cellProps.columnIndex} role={'gridcell'}>
            {/* {formatNumber(cellProps.dataItem.aggregates.pCash.sum, '##,#.00')} */}
            { formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
          
          </td>
        );
        
      } else if (cellProps.field === 'quarterToDate') {
        return (
          <td style={{ textAlign: 'right' }} aria-colindex={cellProps.columnIndex} role={'gridcell'}>
             { formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
          </td>
        );
      }else if (cellProps.field === 'yearToDate') {
        return (
          <td style={{ textAlign: 'right' }} aria-colindex={cellProps.columnIndex} role={'gridcell'}>
             { formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
          </td>
        );
      }
      else if (cellProps.field === 'oneYear') {
        return (
          <td style={{ textAlign: 'right' }} aria-colindex={cellProps.columnIndex} role={'gridcell'}>
             { formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
          </td>
        );
      }
      else if (cellProps.field === 'threeYear') {
        return (
          <td style={{ textAlign: 'right' }} aria-colindex={cellProps.columnIndex} role={'gridcell'}>
             { formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
          </td>
        );
      }
      else if (cellProps.field === 'fiveYear') {
        return (
          <td style={{ textAlign: 'right' }} aria-colindex={cellProps.columnIndex} role={'gridcell'}>
             { formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
          </td>
        );
      }
      else if (cellProps.field === 'tenYear') {
        return (
          <td style={{ textAlign: 'right' }} aria-colindex={cellProps.columnIndex} role={'gridcell'}>
             { formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
          </td>
        );
      }
      else if (cellProps.field === 'inception') {
        return (
          <td style={{ textAlign: 'right' }} aria-colindex={cellProps.columnIndex} role={'gridcell'}>
             { formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
          </td>
        );
      }

    }

    return tdElement;
  };

  const [allocData, setAllocData] = React.useState(alloc);
  
const IntCell = (props) => {
  return (
      <td style={{ textAlign: 'right' }}>
          {props.dataItem[props.field]}
      </td>
  )
}



  

  const pageChange = (event) => {
    setPage(event.page);
  };

  
  const defaultTooltipRender = ({ point }) => `${point.value.toFixed(2)}`;
  const labelContent = (e) => `${e.value.toFixed(2)}`;
  const ChangeLineChart=e=>
  {
    debugger;
    var actId = e.dataItem.acctId;

    var acctData = Enumerable.from(alloc).where(w => w.mainAcctId === actId)
        .toArray();

        setAllocData(acctData);  
        setDataState(e.dataState);  
  }
  return (
    
    <div>
        <div className="card-header row d-flex justify-content-between align-items-center my-2">
        <div className="col">
          <p className="tableheader h6">Account Performance Summary Report</p>
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
              {...dataStateRor}
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

            <div className='card py-2'>
            <div className="card-body">
              <div className="mx-1 px-1 my-1 py-1">
                <Chart style={{ height: "350px" }}>
                                        {/* <ChartTitle text="Maturity Date Vs Call/Put Date" /> */}
                                        <ChartLegend position="top" />
                                        <ChartCategoryAxis>
                                            <ChartCategoryAxisItem
                                                labels={{
                                                    visible: true,
                                                    //rotation: 85,
                                                    format: "d",
                                                }}
                                            //  categories={categoryAxis} 
                                            />
                                        </ChartCategoryAxis>
                                        <ChartTooltip render={defaultTooltipRender} />
                                        <ChartSeries>
                                            <ChartSeriesItem
                                                type="line"
                                                name= 'Start Percent'
                                                data={allocData}
                                                categoryField="assetType"
                                                field="startPercent"
                                                labels={{
                                                    visible: false,
                                                    content: labelContent,
                                                }}
                                            />
                                            <ChartSeriesItem
                                                type="line"
                                                name = 'End Percent'
                                                data={allocData}
                                                categoryField="assetType"
                                                field="endPercent"
                                                labels={{
                                                    visible: false,
                                                    content: labelContent,
                                                }}
                                            />
                                            
                                        </ChartSeries>
                    </Chart>
                
          </div>   
          </div>
          </div>

          <div className="card-header row d-flex justify-content-between align-items-center my-2">
        <div className="col">
          <p className="tableheader h6">ROR Data</p>
        </div>
        <div className="col"></div>
        
      </div>
      <div className="card-body">
        <div className="mx-1 px-1 my-1 py-1">
        <ExcelExport data={ror} ref={_exportRor}> 

        <Grid
              style={{ height: '500px' }}
              data={resultRor}
              {...dataState}
              onDataStateChange={dataStateChangeRor}
              expandField="expanded"
              onExpandChange={expandChangeRor}
              cellRender={cellRenderRor}
              sortable={true}
              // pageable={true}
              // pageSize={20}
              skip={page.skip}
            pageable={{
              pageSizes: true,
            }}
            pageSize={page.take}
            total={ror.length}
              groupable={{
                footer: 'visible',
              }}
            >
              {stateColumnsRor.map(
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
                     
                     //cell={NumberCell}
                      columnMenu={(props) => (
                        <CustomColumnMenu
                          {...props}
                          columns={stateColumnsRor}
                          onColumnsSubmit={onColumnsSubmitRor}
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

export default AcctPerfRptGrid