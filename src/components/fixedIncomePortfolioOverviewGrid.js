import React from 'react'
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
//import { PieChart } from 'react-minimal-pie-chart';
import { Grid, GridColumn as Column, GridToolbar } from "@progress/kendo-react-grid";
import { formatNumber, formatDate } from '@telerik/kendo-intl';
import { ColumnMenu } from "./columnMenu";
import { orderBy } from "@progress/kendo-data-query";

//import BarChart from 'react-bar-chart';

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
const FixedIncomePortfolioOverviewGrid = ({data}) => {
    debugger;
    const chartDefaultV4Colors = [
        "#00876c",
    "#6e9b75",
    "#a5af90",
    "#cbc6b9",
    "#c9a47e",
    "#d07958",
      ];
    
    const [chartType,setChartType]=useState("pie");
    const [sort, setSort] = React.useState([]);
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
    const FormatLongNumber=({value})=> {
       
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
      }
    const labelContent1 = (props) => {

        let formatedNumber = Number(props.dataItem.rtngPercent).toLocaleString(undefined, {
            style: "percent",
            minimumFractionDigits: 2,
        });
        return `${props.category}  ${(props.dataItem.rtngPercent*100).toFixed(2)}%`;
    };
    const labelContentMnr = (props) => {

        let formatedNumber = Number(props.dataItem.classPercent).toLocaleString(undefined, {
            style: "percent",
            minimumFractionDigits: 2,
        });
        return `${props.category}  ${props.dataItem.classPercent.toFixed(2)}%`;
    };
    const labelContentMjr = (props) => {

        let formatedNumber = Number(props.dataItem.sectorPct).toLocaleString(undefined, {
            style: "percent",
            minimumFractionDigits: 2,
        });
        return `${props.category}  ${props.dataItem.sectorPct.toFixed(2)}%`;
    };
    const totalSum = (props) => {
        const field = props.field || "";
        const total = data.lstFixedIncomePortfolioOverviewT3 .reduce((acc, current) => acc + current[field], 0);
        return (
            <td colSpan={props.colSpan} style={{ textAlign: "right" }}>
                {formatNumber(total, "##,#.00")}
            </td>
        );
    };

       return(
        
        <div>
            
            <div className='card-header row d-flex justify-content-between align-items-center my-2'>
  
            <div className='col'>
                <p className='tableheader h6'>Bond Quality Sector:</p>
                <p className='tableheader h6'>Rating</p>
            </div>
            <div className='col'></div>


            </div>            
            <div className="card-body">
            <div className="mx-1 my-1 py-1">
                <Chart seriesColors={chartDefaultV4Colors} style={{ height: "340px" }}>
                {/* <ChartTitle text="Major Asset Chart" /> */}
                <ChartLegend position="right" />
                
                <ChartSeries>
                <ChartSeriesItem
                type={chartType}
                data={data.lstFixedIncomePortfolioOverviewT2}
                field="rtngPercent"
                categoryField="rating"
                labels={{
                    visible: true,
                   content: labelContent1,
                }}
                    />
                </ChartSeries>
            </Chart>
            </div>
            </div>
       
            <div className='card-header row d-flex justify-content-between align-items-center my-2'>
  
            <div className='col'>
                <p className='tableheader h6'>Maturity Ladder:</p>
                <p className='tableheader h6'>Description</p>
            </div>
            <div className='col'></div>


            </div>       
            <div className="card-body">
            <div className="mx-1 my-1 py-1">
    
            
            
                
                    
                    
                    
                    <Grid style={{ height: "330px" }}
                        data={orderBy(data.lstFixedIncomePortfolioOverviewT3.slice(), sort)}
                        sortable={true}
                        sort={sort}
                        onSortChange={(e) => {
                            setSort(e.sort);
                        }}
                    >

                        <Column field="ratingDesc" menu={true} title="Description" width="150px" />
                        <Column field="shares" menu={true} title="Par Value" width="150px"  columnMenu={ColumnMenu} cell={NumberCell} headerCell={RightNameHeader} />
                        <Column field="avgYield" menu={true} title="Avg Yield" width="150px" footerCell={totalSum} columnMenu={ColumnMenu} cell={NumberCell} headerCell={RightNameHeader} />
                        <Column field="avgYTM" menu={true} title="Avg YTM" width="150px" footerCell={totalSum} columnMenu={ColumnMenu} cell={NumberCell} headerCell={RightNameHeader} />
                        <Column field="avgDuration" menu={true} title="Avg Duration" width="150px" footerCell={totalSum} columnMenu={ColumnMenu} cell={NumberCell} headerCell={RightNameHeader} />
                        <Column field="avgMaturity" menu={true} title="Avg Maturity" width="150px" footerCell={totalSum} columnMenu={ColumnMenu} cell={NumberCell} headerCell={RightNameHeader} />
                        <Column field="avgYTW" menu={true} title="Avg YTW" width="150px" footerCell={totalSum} columnMenu={ColumnMenu} cell={NumberCell} headerCell={RightNameHeader} />
                        <Column field="avgCalPutDuration" menu={true} title="Avg Duration(Call/Put)" width="150px" footerCell={totalSum} columnMenu={ColumnMenu} cell={NumberCell} headerCell={RightNameHeader} />

                    </Grid>
                    
                     </div>
                     </div>   
                    
                     <div className="card-body">
                        <div className="mx-1 my-1 py-1">                    
                

                    <Chart seriesColors={chartDefaultV4Colors} style={{ height: "500px" }}>
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
                                        {/*<ChartTooltip render={defaultTooltipRender} />*/}
                                        <ChartSeries>
                                            <ChartSeriesItem
                                                type="column"
                                                data={data.lstFixedIncomePortfolioOverviewT3}
                                                field="shares"
                                                categoryField="ratingDesc"

                                                /*labels={{
                                                    visible: false,
                                                    content: labelContent,
                                                }}*/
                                            />
                                        </ChartSeries>
                                    </Chart>
                        </div>
                        </div>
                
<div className='card-header row d-flex justify-content-between align-items-center my-2'>
  
  <div className='col'>
      <p className='tableheader h6'>Bonds: By Asset Classification</p>
      <p className='tableheader h6'>Minor Class</p>
  </div>
  <div className='col'></div>


  </div>       
  <div className="card-body">
  <div className="mx-1 my-1 py-1">             

                

                            
                <Chart seriesColors={chartDefaultV4Colors} style={{ height: "400px" }}>
                {/* <ChartTitle text="Major Asset Chart" /> */}
                <ChartLegend position="right" />

                <ChartSeries>
                <ChartSeriesItem
                type={chartType}
                data={data.lstFixedIncomePortfolioOverviewT4}
                field="classPercent"
                categoryField="minorClass"
                labels={{
                    visible: true,
                    content: labelContentMnr,
                }}
                    />
                </ChartSeries>
            </Chart>
        </div>
        </div>

        <div className='card-header row d-flex justify-content-between align-items-center my-2'>
  
  <div className='col'>
      <p className='tableheader h6'>Bonds: By Industry Sector</p>
      <p className='tableheader h6'>Major Industry</p>
  </div>
  <div className='col'></div>


  </div>       
  <div className="card-body">
  <div className="mx-1 my-1 py-1">   

    
                <Chart seriesColors={chartDefaultV4Colors} style={{ height: "400px" }}>
                {/* <ChartTitle text="Major Asset Chart" /> */}
                <ChartLegend position="right" />

                <ChartSeries>
                <ChartSeriesItem
                type={chartType}
                data={data.lstFixedIncomePortfolioOverviewT5}
                field="sectorPct"
                categoryField="indSector"
                labels={{
                    visible: true,
                    content: labelContentMjr,
                }}
                    />
                </ChartSeries>
            </Chart>
        
</div>
</div>
                
    </div>
    )
}
export default FixedIncomePortfolioOverviewGrid