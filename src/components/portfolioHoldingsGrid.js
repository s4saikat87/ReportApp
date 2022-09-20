import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Grid, GridColumn as Column, GridToolbar } from "@progress/kendo-react-grid";
import { process } from '@progress/kendo-data-query';
import { ExcelExport } from '@progress/kendo-react-excel-export';
import { formatNumber, formatDate } from '@telerik/kendo-intl';
import { CustomColumnMenu } from './customColumnMenu';
//import products from './products.json';

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
  const aggregates = [
    
    
    
   
    {
      field: "totMarket",
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
const PortfolioHoldingsGrid = ({data}) => {
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
      title: 'Inv. Objective',
      field: 'invstmntObj',
      minWidth: 150,
      show: true,
      filter: 'text',
      locked: true,
    },
    {
      title: 'Acct Type',
      field: 'accountType',
      minWidth: 150,
      show: true,
      filter: 'text',
      locked: true,
    },
    {
      title: 'Account#',
      field: 'account',
      minWidth: 150,
      show: true,
      filter: 'text',
      locked: true,
    },
    {
      title: 'Ticker/Cusip',
      field: 'tckerCusip',
      minWidth: 150,
      show: true,
      filter: 'text',
      locked: false,
    },
    {
      title: 'Description',
      field: 'assetShrtNm',
      minWidth: 180,
      show: true,
      filter: 'text',
      locked: false,
    },
    {
      title: 'Units',
      field: 'units',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
    },
    {
      title: 'Cost($)',
      field: 'txcstAmt',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
    },
    {
      title: 'Price($)',
      field: 'price',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
     
    },
    {
      title: 'Market($)',
      field: 'totMarket',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
      footerCell: totalSum ,
    },
    {
      title: 'GainLoss($)',
      field: 'gainLoss',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
      
    },
    {
      title: 'Income($)',
      field: 'income',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
      
    },
    {
      title: 'Yield(%)',
      field: 'yield',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
      
    },
    {
      title: 'Principal($)',
      field: 'p1CashBlncAmt',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
      
    },
    {
      title: 'Inv. Income($)',
      field: 'p2P3CashBlncAmt',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
      
    },
    {
      title: 'UnEx. Cash($)',
      field: 'unExecCashAmt',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
      
    },
    {
      title: 'Trade Cash($)',
      field: 'tradeCash',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
      
    },
    {
      title: 'Excld Cash($)',
      field: 'excldCashAmt',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
      
    },
    {
      title: 'Equity %',
      field: 'equityPercent',
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
    //     field: 'account',
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

    
    
    const [mnrRadioStat, setMnrRadioStat] = useState('checked');
    const defaultTooltipRender = ({ point }) => `${point.value.toFixed(2)}`;
    const labelContent = (e) => `${e.value.toFixed(2)}`;
  
    const handleClick = () => {
      setLocked(!locked);
    };
    
    const _grid = React.useRef();
    
    
    const [gridChartCheck, setgridChartCheck] = useState('checked');
    
    const [collapsedState, setCollapsedState] = React.useState([]);
    

    const chartDefaultV4Colors = [
      "#0275d8",
      "#5bc0de",
      "#5cb85c",
      "#f0ad4e",
      "#e67d4a",
      "#d9534f",
    ];

    const handleSetDataChecked = () => {
      
      setgridChartCheck('checked');

  }
  const handleSetChartChecked = () => {
      
    setgridChartCheck('');

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
          { field: 'invstmntObj' },
          { field: 'accountType' },
          { field: 'account'},
          { field: 'tckerCusip'},
          { field: 'assetShrtNm'},
          { field: 'units'},
          { field: 'txcstAmt'},
          { field: 'price' },
          { field: 'totMarket', aggregate: 'sum' },
          { field: 'gainLoss' },
          { field: 'income' },
          { field: 'yield' },
          { field: 'p1CashBlncAmt' },
          { field: 'p2P3CashBlncAmt' },
          { field: 'unExecCashAmt' },
          { field: 'tradeCash'},
          { field: 'excldCashAmt'},
          { field: 'equityPercent'},
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
        
        if (cellProps.field === 'totMarket') {
          return (
            <td aria-colindex={cellProps.columnIndex} role={'gridcell'}>
              {cellProps.dataItem.aggregates.totMarket.sum}
            </td>
          );
        }
       
        
      }
      if (cellProps.rowType === "data") {

        if (cellProps.field === "totMarket") {
  
          return (
            <td style={{ textAlign: 'right' }} aria-colindex={cellProps.columnIndex} role={"gridcell"}>
                {formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
            </td>
          );
        }
        if (cellProps.field === "units") {
  
          return (
            <td style={{ textAlign: 'right' }} aria-colindex={cellProps.columnIndex} role={"gridcell"}>
                {formatNumber(cellProps.dataItem[cellProps.field], "##,#.000000")}
            </td>
          );
        }
        if (cellProps.field === "txcstAmt") {
  
          return (
            <td style={{ textAlign: 'right' }} aria-colindex={cellProps.columnIndex} role={"gridcell"}>
               {formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
            </td>
          );
        }
        if (cellProps.field === "price") {
  
          return (
            <td style={{ textAlign: 'right' }} aria-colindex={cellProps.columnIndex} role={"gridcell"}>
               {formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
            </td>
          );
        }
        if (cellProps.field === "gainLoss") {
  
          return (
            <td style={{ textAlign: 'right' }} aria-colindex={cellProps.columnIndex} role={"gridcell"}>
               {formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
            </td>
          );
        }
        if (cellProps.field === "income") {
  
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
        if (cellProps.field === "p1CashBlncAmt") {
  
          return (
            <td style={{ textAlign: 'right' }} aria-colindex={cellProps.columnIndex} role={"gridcell"}>
               {formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
            </td>
          );
        }
        if (cellProps.field === "p2P3CashBlncAmt") {
  
          return (
            <td style={{ textAlign: 'right' }} aria-colindex={cellProps.columnIndex} role={"gridcell"}>
               {formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
            </td>
          );
        }
        if (cellProps.field === "unExecCashAmt") {
  
          return (
            <td style={{ textAlign: 'right' }} aria-colindex={cellProps.columnIndex} role={"gridcell"}>
               {formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
            </td>
          );
        }
        if (cellProps.field === "tradeCash") {
  
          return (
            <td style={{ textAlign: 'right' }} aria-colindex={cellProps.columnIndex} role={"gridcell"}>
               {formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
            </td>
          );
        }
        if (cellProps.field === "excldCashAmt") {
  
          return (
            <td style={{ textAlign: 'right' }} aria-colindex={cellProps.columnIndex} role={"gridcell"}>
               {formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
            </td>
          );
        }
        if (cellProps.field === "equityPercent") {
  
          return (
            <td style={{ textAlign: 'right' }} aria-colindex={cellProps.columnIndex} role={"gridcell"}>
               {formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
            </td>
          );
        }
      }
      return tdElement;
    };
  
    const NumberCell = (props) => {
      debugger;
      if(props.field==='invstmntObj'){
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
        if(props.field==='account'){
          return (
              <td style={{ textAlign: 'left' }}>
                  {props.dataItem[props.field]}
              </td>
          )
          }
        if(props.field==='tckerCusip'){
          return (
              <td style={{ textAlign: 'left' }}>
                  {props.dataItem[props.field]}
              </td>
          )
          }
      if(props.field==='assetShrtNm'){
      return (
          <td style={{ textAlign: 'left' }}>
              {props.dataItem[props.field]}
          </td>
      )
      }
      if(props.field==='units'){
        return (
            <td style={{ textAlign: 'right' }}>
                {formatNumber(props.dataItem[props.field], "##,#.00")}
            </td>
        )
        }
        if(props.field==='txcstAmt'){
          return (
              <td style={{ textAlign: 'right' }}>
                  {formatNumber(props.dataItem[props.field], "##,#.00")}
              </td>
          )
          }
          if(props.field==='price'){
            return (
                <td style={{ textAlign: 'right' }}>
                    {formatNumber(props.dataItem[props.field], "##,#.00")}
                </td>
            )
            }
            if(props.field==='totMarket'){
              return (
                  <td style={{ textAlign: 'right' }}>
                      {formatNumber(props.dataItem[props.field], "##,#.00")}
                  </td>
              )
              }
              if(props.field==='gainLoss'){
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
                  if(props.field==='yield'){
                    return (
                        <td style={{ textAlign: 'right' }}>
                            {formatNumber(props.dataItem[props.field], "##,#.00")}
                        </td>
                    )
                  }
                  if(props.field==='p1CashBlncAmt'){
                    return (
                        <td style={{ textAlign: 'right' }}>
                            {formatNumber(props.dataItem[props.field], "##,#.00")}
                        </td>
                     )
                    }
                    if(props.field==='p2P3CashBlncAmt'){
                        return (
                            <td style={{ textAlign: 'right' }}>
                                {formatNumber(props.dataItem[props.field], "##,#.00")}
                            </td>
                        )
                    }
                   if(props.field==='unExecCashAmt'){
                      return (
                          <td style={{ textAlign: 'right' }}>
                              {formatNumber(props.dataItem[props.field], "##,#.00")}
                          </td>
                      )
                   }
                  if(props.field==='tradeCash'){
                     return (
                          <td style={{ textAlign: 'right' }}>
                              {formatNumber(props.dataItem[props.field], "##,#.00")}
                          </td>
                        )
                     }
                     if(props.field==='excldCashAmt'){
                      return (
                           <td style={{ textAlign: 'right' }}>
                               {formatNumber(props.dataItem[props.field], "##,#.00")}
                           </td>
                         )
                      }
                      if(props.field==='equityPercent'){
                        return (
                             <td style={{ textAlign: 'right' }}>
                                 {formatNumber(props.dataItem[props.field], "##,#.00")}
                             </td>
                           )
                        }
                            
                
    }
    
  const labelContent1 = (e) => `${e.value.toFixed(2)}`;
  const FormatLongNumber=({value})=> {
    debugger;
    if(value == 0) {
      return 0;
    }
    else
    {

        // hundreds
        if(value <= 999){
          return value;
        }
        // thousands
        else if(value >= 1000 && value <= 999999){
          return (value / 1000).toFixed(2) + 'K';
        }
        // millions
        else if(value >= 1000000 && value <= 999999999){
          return (value / 1000000).toFixed(2) + 'M';
        }
        // billions
        else if(value >= 1000000000 && value <= 999999999999){
          return (value / 1000000000).toFixed(2) + 'B';
        }
        else
          return value.toFixed(2);
    }
  };
    return (
      
      <div>
          {
          
          <div className='card-header row d-flex justify-content-between align-items-center my-2'>
  
            <div className='col'>
              <p className='tableheader h6'>Portfolio Holdings Report</p>
            </div>
            <div className='col'></div>         
            <div className='col'>
              <button 
              className='k-button k-button-sm k-rounded-sm k-button-solid k-button-solid-primary' 
              onClick={excelExport}>Export to Excel</button>
            </div>
  
          </div>

          }

          {/* <div className="">
              <div className="form-check mt-1 k-text-center py-2 mb-2">
                  <div className="btn-group btn-group-sm" role="group" aria-label="Basic radio toggle button group">
                      <input type="radio" className="btn-check form-check-input" name="btnradio" id="radio1" onClick={handleSetChartChecked}/>
                      <label className="btn btn-outline-primary btn-sm" htmlFor="radio1">Chart</label>
                      <input type="radio" className="btn-check form-check-input" name="btnradio" id="radio2" onClick={handleSetDataChecked} />
                      <label className="btn btn-outline-primary btn-sm" htmlFor="radio2">Data</label>
                    </div>
                  </div>
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
              resizable={true}
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
            <div className='card-header row d-flex justify-content-between align-items-center my-2'>
  
              <div className='col'>
                <p className='tableheader h6'>Portfolio Holdings - By Asset Class</p>
              </div>
              <div className='col'></div>
  

            </div>
            <div className="card-body">
            <div className="mx-1 my-1 py-1">
              <Chart seriesColors={chartDefaultV4Colors} style={{ height: "440px" }}
                
                
              >
                
                {/* <ChartTitle text="Major Asset Chart" /> */}
                  <ChartLegend position="bottom" />
                  <ChartValueAxis>
                    <ChartValueAxisItem
                                              
                        min={0}
                        labels={{
                          visible: true,
                                            
                            // rotation: 85,
                            //format: "d",
                            content:FormatLongNumber
                                          
                            }}
                      />
                    </ChartValueAxis>
                    <ChartSeries>
                        <ChartSeriesItem
                            type="column"
                            data={data}
                            field="totMarket"
                            categoryField="majorAssetType"
                            aggregate='sum'
                            labels={{
                            visible: true,
                            content: FormatLongNumber,
                            }}
                          />
                      </ChartSeries>
                </Chart>
              </div>
              </div>
              <div className='card-header row d-flex justify-content-between align-items-center my-2'>
  
                <div className='col'>
                <p className='tableheader h6'>Portfolio Holdings - By Asset Category</p>
              </div>
              <div className='col'></div>
              </div>
              <div className="card-body">
            <div className="mx-1 my-1 py-1">
                <Chart seriesColors={chartDefaultV4Colors} style={{ height: "500px" }}>
                                          {/* <ChartTitle text="Major Asset Chart" /> */}
                  <ChartLegend position="bottom" />

                    <ChartValueAxis>
                      <ChartValueAxisItem
                                              
                        min={0}
                        labels={{
                        visible: true,
                                            
                                            
                        content:FormatLongNumber
                                            
                        }}
                      />
                      </ChartValueAxis>
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
                            field="totMarket"
                            categoryField="minorAssetType"

                            labels={{
                              visible: false,
                              content: labelContent,
                            }}
                          />
                        </ChartSeries>
                  </Chart>
                </div>
               </div>
                {/* <div className='col'>
                  <p className='tableheader h6'>Portfolio Holdings - Asset</p>
                </div>
                <div className='col'></div> */}
                {/* <Chart style={{ height: "500px" }}>
                {/
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
                    type="area"
                    data={data}
                    field="marketPercent"
                    categoryField="astShrtNm"

                    labels={{
                      visible: false,
                      content: labelContent,
                    }}
                  />
                </ChartSeries>
              </Chart> */}


              
  

        
      </div>
    )
  }
  
  export default PortfolioHoldingsGrid