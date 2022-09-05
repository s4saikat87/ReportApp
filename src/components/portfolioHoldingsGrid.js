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
      field: "price",
      aggregate: "sum",
    },
    {
      field: "gainLoss",
      aggregate: "sum",
    },
    {
      field: "income",
      aggregate: "sum",
    },
    {
      field: "yield",
      aggregate: "sum",
    },
    {
      field: "totMarket",
      aggregate: "sum",
    },
    {
      field: "p1CashBlncAmt",
      aggregate: "sum",
    },
    {
      field: "p2P3CashBlncAmt",
      aggregate: "sum",
    },
    {
      field: "tradeCash",
      aggregate: "sum",
    },
    {
      field: "unExecCashAmt",
      aggregate: "sum",
    }
  ];
  const initialGroup = [
    {
      field: "invstmntObj",
    },
    {
      field: "account",
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
const PortfolioHoldingsGrid = ({data}) => {
    const [locked, setLocked] = React.useState(false);
    const [group, setGroup] = React.useState(initialGroup);
    const [mnrRadioStat, setMnrRadioStat] = useState('checked');
    const defaultTooltipRender = ({ point }) => `${point.value.toFixed(2)}`;
    const labelContent = (e) => `${e.value.toFixed(2)}`;
  
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
    const [gridChartCheck, setgridChartCheck] = useState('checked');
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

    const onDataStateChange = React.useCallback((e) => {
   
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
    const onGroupChange = React.useCallback((event) => {
      const newDataState = processWithGroups(newData, event.group);
      setGroup(event.group);
      setResultState(newDataState);
    }, []);

  //   const labelContent1 = (props) => {

  //     let formatedNumber = Number(props.dataItem.marketPercent).toLocaleString(undefined, {
  //         style: "percent",
  //         minimumFractionDigits: 2,
  //     });
  //     return `${props.category}  ${props.dataItem.marketPercent.toFixed(2)}%`;
  // };
  const labelContent1 = (e) => `${e.value.toFixed(2)}`;
  const FormatLongNumber=({value})=> {
    debugger;
    if(value == 0) {
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
              <button className='btn btn-outline-primary btn-sm' onClick={excelExport}>Export to Excel</button>
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
            <Grid style={{ height: "600px" }}
                  data={newData}
                  // onGroupChange={onGroupChange}
                  // group={group}
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
                <Column field="invstmntObj" menu={true} title="Inv. Objective" width="150px" locked={true} columnMenu={ColumnMenu}/>
                <Column field="accountType" menu={true} title="Account Type" width="150px" locked={true} columnMenu={ColumnMenu}/>
                <Column field="account" menu={true} title="Account#" width="150px" locked={true} columnMenu={ColumnMenu}/>
                <Column field="tckerCusip" title="Ticker/Cusip " width="150px" locked={true} columnMenu={ColumnMenu}/>
                
                <Column field="assetShrtNm" title="Asst Short Name" width="150px" columnMenu={ColumnMenu}/>
                
                <Column field="units" title="Units" width="150px" columnMenu={ColumnMenu} cell={NumberCell}  format="{0:n2}"/>
                <Column field="txcstAmt" title="Cost" width="150px" columnMenu={ColumnMenu} cell={NumberCell} format="{0:n2}"/>
                <Column field="price" title="Price" width="150px" columnMenu={ColumnMenu} cell={NumberCell} footerCell={totalSum} format="{0:n2}"/>
                <Column field="totMarket" title="Market" width="150px" columnMenu={ColumnMenu} cell={NumberCell} footerCell={totalSum} format="{0:n2}"/>
                <Column field="gainLoss" title="Gain Loss" width="150px" columnMenu={ColumnMenu} cell={NumberCell} footerCell={totalSum} format="{0:n2}"/>
                <Column field="income" title="Income" width="150px" columnMenu={ColumnMenu} cell={NumberCell} footerCell={totalSum} format="{0:n2}"/> 
                <Column field="yield" title="Yield" width="150px" columnMenu={ColumnMenu} cell={NumberCell} footerCell={totalSum} format="{0:p2}"/>
                
                <Column field="p1CashBlncAmt" title="Principal" width="150px" columnMenu={ColumnMenu} cell={NumberCell} footerCell={totalSum} format="{0:n2}"/>
                <Column field="p2P3CashBlncAmt" title="Income Cash" width="150px" columnMenu={ColumnMenu} cell={NumberCell} footerCell={totalSum} format="{0:n2}"/>
                <Column field="unExecCashAmt" title="UnExecCashAmt" width="150px" columnMenu={ColumnMenu} cell={NumberCell} footerCell={totalSum} format="{0:n2}"/>
                <Column field="tradeCash" title="Trade Cash" width="150px" columnMenu={ColumnMenu} cell={NumberCell} footerCell={totalSum} format="{0:n2}"/>
                <Column field="excldCashAmt" title="ExcldCashAmt" width="150px" columnMenu={ColumnMenu} cell={NumberCell}  format="{0:n2}"/>
                <Column field="equityPercent" title="Equity Percent" width="150px" columnMenu={ColumnMenu} cell={NumberCell}  format="{0:n2}"/>

                
                </Grid>
            </ExcelExport> 
            </div>
            </div>
            <div className='card-header row d-flex justify-content-between align-items-center my-2'>
  
              <div className='col'>
                <p className='tableheader h6'>Portfolio Holdings - Major Asset</p>
              </div>
              <div className='col'></div>
  

            </div>
            <Chart seriesColors={chartDefaultV4Colors} style={{ height: "440px" }}
              onPlotAreaClick={(e) => 
                console.log(e)
              
              }
              
            >
              
              {/* <ChartTitle text="Major Asset Chart" /> */}
                <ChartLegend position="bottom" />
                <ChartValueAxis>
                                        <ChartValueAxisItem
                                            // title={{
                                            //     text: "Percentage",
                                            // }}
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
                          content: labelContent1,
                          }}
                        />
                    </ChartSeries>
              </Chart>
              <div className='card-header row d-flex justify-content-between align-items-center my-2'>
  
                <div className='col'>
                <p className='tableheader h6'>Portfolio Holdings - Minor Asset</p>
              </div>
              <div className='col'></div>
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
                          field="marketPercent"
                          categoryField="minorAssetType"

                          labels={{
                            visible: false,
                            content: labelContent,
                          }}
                        />
                      </ChartSeries>
                </Chart>
               
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
      </div>
    )
  }
  
  export default PortfolioHoldingsGrid