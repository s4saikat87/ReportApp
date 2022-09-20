import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Grid, GridColumn as Column, GridToolbar } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import { ExcelExport } from '@progress/kendo-react-excel-export';
import Moment from 'react-moment';
import { formatNumber, formatDate  } from '@telerik/kendo-intl';
import { ColumnMenu } from "./columnMenu";
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

const aggregates = [
    {
      field: "marketPercent",
      aggregate: "sum",
    },
    {
        field: "bmPcnt",
        aggregate: "sum",
    },
    {
        field: "varBMPcnt",
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

const AcctSectBenchRptGrid = ({data}) => {
    debugger;
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

  const NumberCell = (props) => {
    //debugger;
    if(props.field==='account'){
      return (
          <td style={{ textAlign: 'left' }}>
              {props.dataItem[props.field]}
          </td>
      )
      }
      if(props.field==='groupHeader'){
        return (
            <td style={{ textAlign: 'left' }}>
                {props.dataItem[props.field]}
            </td>
        )
        }
    if(props.field==='marketPercent'){
    return (
        <td style={{ textAlign: 'right' }}>
            {formatNumber(props.dataItem[props.field], "##,#.00")}
        </td>
    )
    }
    if(props.field==='bmPcnt'){
      return (
          <td style={{ textAlign: 'right' }}>
              {formatNumber(props.dataItem[props.field], "##,#.00")}
          </td>
      )
      }
      if(props.field==='varBMPcnt'){
        return (
            <td style={{ textAlign: 'right' }}>
                {formatNumber(props.dataItem[props.field], "##,#.00")}
            </td>
        )
        }
        
              
  }

  const columns = [
    {
      title: 'Account',
      field: 'account',
      minWidth: 300,
      show: true,
      filter: 'text',
      locked: true,
    },
    {
      title: 'Description',
      field: 'groupHeader',
      minWidth: 300,
      show: true,
      filter: 'text',
      locked: true,
    },
    {
      title: 'Portfolio Holdings %',
      field: 'marketPercent',
      minWidth: 250,
      show: true,
      filter: 'text',
      locked: false,
    },
    {
      title: 'Model Weighting %',
      field: 'bmPcnt',
      minWidth: 250,
      show: true,
      filter: 'text',
      locked: false,
    },
    {
      title: 'Variance to Model %',
      field: 'varBMPcnt',
      minWidth: 250,
      show: true,
      filter: 'text',
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
    group: [
      {
        field: 'groupHeader',
      },
    ],
  });

  const [result, setResult] = React.useState(
    processWithGroups(data, initialState.dataState)
  );
  //setResultState(process({data}, initialDataState))
  
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
  }; 

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
        { field: 'account' },
        { field: 'groupHeader' },
        
        { field: 'marketPercent', aggregate: 'sum' },
        { field: 'bmPcnt', aggregate: 'sum' },
        { field: 'varBMPcnt', aggregate: 'sum' },
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
      if (cellProps.field === 'marketPercent') {
        return (
          <td aria-colindex={cellProps.columnIndex} role={'gridcell'}>
            {cellProps.dataItem.aggregates.marketPercent.sum}
          </td>
        );
      }
      if (cellProps.field === 'bmPcnt') {
        return (
          <td aria-colindex={cellProps.columnIndex} role={'gridcell'}>
            {cellProps.dataItem.aggregates.bmPcnt.sum}
          </td>
        );
      }
      if (cellProps.field === 'varBMPcnt') {
        return (
          <td aria-colindex={cellProps.columnIndex} role={'gridcell'}>
            {cellProps.dataItem.aggregates.varBMPcnt.sum}
          </td>
        );
      }
    }

    return tdElement;
  };

 
  const pageChange = (event) => {
    setPage(event.page);
  };

  
  const defaultTooltipRender = ({ point }) => `${point.value.toFixed(2)}`;
  const labelContent = (e) => `${e.value.toFixed(2)}`;
  return (
    
    <div>
        <div className="card-header row d-flex justify-content-between align-items-center my-2">
        <div className="col">
          <p className="tableheader h6">Account Sectors Comparison Report</p>
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
             //reorderable={true}
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
              <GridToolbar>
          <button
            title="Export Excel"
            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
            onClick={excelExport}
          >
            Export to Excel
          </button>
          
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
                      cell={NumberCell}
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
          <Chart style={{ height: "350px" }}>
                                        {/* <ChartTitle text="Maturity Date Vs Call/Put Date" /> */}
                                        <ChartLegend position="bottom" />
                                        <ChartCategoryAxis>
                                            <ChartCategoryAxisItem
                                                labels={{
                                                    visible: true,
                                                    rotation: 85,
                                                    format: "d",
                                                }}
                                            //  categories={categoryAxis} 
                                            />
                                        </ChartCategoryAxis>
                                        <ChartTooltip render={defaultTooltipRender} />
                                        <ChartSeries>
                                            <ChartSeriesItem
                                                type="column"
                                                data={data}
                                                categoryField="groupHeader"
                                                field="marketPercent"
                                                labels={{
                                                    visible: false,
                                                    content: labelContent,
                                                }}
                                            />
                                            <ChartSeriesItem
                                                type="column"
                                                data={data}
                                                categoryField="groupHeader"
                                                field="bmPcnt"
                                                labels={{
                                                    visible: false,
                                                    content: labelContent,
                                                }}
                                            />
                                        </ChartSeries>
                                    </Chart>
          </ExcelExport>   

   

          </div>
          </div>
    </div>
  )
}

export default AcctSectBenchRptGrid