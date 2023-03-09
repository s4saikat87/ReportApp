
import React from 'react'
import { useState, useEffect } from 'react'
import {
    Sparkline,
    Chart,
    ChartSeries,
    ChartSeriesItem,
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



const ChartDetailsMjr = ({ chartData }) => {
   
    const [chartLdata,setChartLdata]=useState(chartData);
   
    const [chartNewData,setChartdata]=useState({});
    const labelContent = (e) => `${e.category}: \n ${e.value}%`;
    useEffect(() => {
        const fetchData = async () => {
         
            try {

                {
                   

                }


                
            } catch (error) {
                console.error(error.message);
            }

        }
        fetchData();
    }, []);

    
    return (
        <div className='container' >
            <Chart>
    
    <ChartLegend position="bottom" />
    <ChartSeries>
      <ChartSeriesItem
        type="pie"
        data={chartLdata}
        field="mv"
        categoryField="mjrAstType"
       
        labels={{
          visible: true,
          content: labelContent,
        }}
      />
    </ChartSeries>
  </Chart>



        </div>
    )
}

export default ChartDetailsMjr