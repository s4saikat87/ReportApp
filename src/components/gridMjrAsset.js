import React from 'react'
import { useState,useEffect } from 'react'
import GridChartMnrAsset from './gridChartMnrAsset';
import Loading from './loading';
import { Grid, GridColumn as Column, GridToolbar } from "@progress/kendo-react-grid";
import Enumerable from 'linq';
import 'hammerjs';
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
import { formatNumber, formatDate  } from '@telerik/kendo-intl';
const GridMjrAsset = ({ data, mnrData, astData, loading,performData }) => {
   
    //const labelContent = (e) => `${e.category}: \n  ${e.value}%`;
    const labelContent = (e) => `$${formatNumber(e.value, "##,#.00")}`;
    // const labelContent = (e) => e.category;
    const [mjrPie, setMjrPie] = useState(1);
    const [mjrBar, setMjrBar] = useState(0);
    const [mjrRadioStat, setMjrRadioStat] = useState('checked');
    const [updatedMnrDataNew, setUpdatedMnrDataNew] = useState(mnrData);
    const [updatedAssetDataNew, setUpdatedAssetDataNew] = useState(astData);
   const[selMjrAsset,SetSelMjrAsset]=useState('');
    const[changeSelect,setChangeSelect]=useState(JSON.parse(localStorage.getItem('changeSelect')));
    const chartDefaultV4Colors = [
        "#235ee7",
        "#dce4ea",
        "#4ac9c9",
        "#d3dffb",
        "#7c9ff2",
        "#f3b021",
        "#f8d0c0",
      ];
    
    // useEffect(() => {
    //     debugger;
    //     setChangeSelect(JSON.parse(localStorage.getItem('changeSelect'))) ;
    // }, [])



    const labelContent1 = (props) => {

        let formatedNumber = Number(props.dataItem.mvPercent).toLocaleString(undefined, {
            style: "percent",
            minimumFractionDigits: 2,
        });
        return `${props.category}  ${props.dataItem.mvPercent.toFixed(2)}% \n $${formatNumber(props.dataItem.mv, "##,#.00")}`;
    };
    const defaultTooltipRender = ({ point }) => `$${formatNumber(point.value, "##,#.00")}`;

    const plotareaclick=(e)=>{
       

        var mjrAsetTypeNm = e.category;
        SetSelMjrAsset(mjrAsetTypeNm);
      //  var mjrAsetTypeRow=Enumerable.from(data).where(w => w.mjrAstType === mjrAsetTypeNm);
        var mjrAsetTypeRow = Enumerable.from(data)
        .where(w => w.mjrAstType === mjrAsetTypeNm).toArray();
    
        var mjrAsetTypeId=mjrAsetTypeRow[0].mjrAstTypId;
        var mnrAstdata = Enumerable.from(mnrData).where(w => w.mjrAstTypId === mjrAsetTypeId)
            .toArray();
        var assetData = Enumerable.from(astData).where(w => w.mjrAstTypId === mjrAsetTypeId)
            .toArray();
        setUpdatedMnrDataNew(mnrAstdata);
        setUpdatedAssetDataNew(assetData);
       
        localStorage.setItem('changeSelect', "0");
        localStorage.setItem('changeMinor', "0");
        setChangeSelect(0);

    }

    const handleSetPie = () => {
        setMjrPie(1);
        setMjrBar(0);
        setMjrRadioStat('checked');

    }
    const onRowClick = e => {
       
        var mjrAsetType = e.dataItem.mjrAstTypId;
        var mnrAstdata = Enumerable.from(mnrData).where(w => w.mjrAstTypId === mjrAsetType)
            .toArray();
        var assetData = Enumerable.from(astData).where(w => w.mjrAstTypId === mjrAsetType)
            .toArray();
        setUpdatedMnrDataNew(mnrAstdata);
        setUpdatedAssetDataNew(assetData);
       
        localStorage.setItem('changeSelect', "0");
        localStorage.setItem('changeMinor', "0");
        setChangeSelect(0);
        //var Data = mnrData.find((mjrTypeDtls) => mjrTypeDtls.mjrAstTypId === mjrAsetType);
        //console.log( Data);

    };
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

    const handleSetBar = () => {
        setMjrBar(1);
        setMjrPie(0);
        setMjrRadioStat('');
    }


    const FormatLongNumber=({value})=> {

       

        if(value == 0) {

          return 0;

        }

        else

        {

           

             

            if(value <= 999 && value>=-999){

              return value;

            }

 

           

            // thousands

            else if(value >= 1000 && value <= 999999 ){

              return (value / 1000) + 'K';

            }

            // millions

            else if(value >= 1000000 && value <= 999999999 ){

              return (value / 1000000) + 'M';

            }

            // billions

            else if(value >= 1000000000 && value <= 999999999999 ){

              return (value / 1000000000) + 'B';

            }

 

            else if(value <= -1000 && value >= -999999 ){

                return (value / 1000) + 'K';

              }

              else if(value <= -1000000 && value >= -999999999 ){

                return (value / 1000) + 'M';

              }

              else if(value <= -1000000000 && value >= -999999999999 ){

                return (value / 1000) + 'B';

              }

            else

              return value;

        }

      }



    if (loading) {
        return <Loading />
    }
    return (


        <div>


<div className='row py-1 my-1 mx-1'>
        <div className='col-sm-10 col-md-6 col-lg-6 my-1'>

            <div className='card rounded h-100'>

                    <div className='card-header'><span className='tableheader'>Class</span> <small>(^Exclude Quantity)</small></div>
                    <div className='card-body'>

                    <Chart onSeriesClick={plotareaclick}
     seriesColors={chartDefaultV4Colors} style={{ height: "400px" }}>
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
                format: "d",
               content:FormatLongNumber
             
            }}
            />
        </ChartValueAxis>
        {/* <ChartTooltip  /> */}
        <ChartSeries>
            <ChartSeriesItem
                type="pie"
                // overlay={{
                //     gradient: "sharpBevel",
                //   }}
                data={data}
                field="mv"
                categoryField="mjrAstType"

                labels={{
                    visible: true,
                    format: "d",
                    content: labelContent1,
                }}
            />
        </ChartSeries>
    </Chart>
                    </div>

            </div>


        </div>


        <div className='col-sm-10 col-md-6 col-lg-6 my-1'>

            <div className='card rounded h-100'>

                    <div className='card-header tableheader'>Activities</div>
                    <div className='card-body'>
                    {performData.length===1?

<Chart 
   
    
seriesColors={chartDefaultV4Colors} style={{ height: "400px" }}>
    
    <ChartLegend position="bottom" />
    <ChartValueAxis>
                                    <ChartValueAxisItem
                                        // title={{
                                        //     text: "Percentage",
                                        // }}
                                       // min={0}
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
                                                rotation: 60,
                                                format: "d",
                                            }}
                                        //  categories={categoryAxis} 
                                        />
                                    </ChartCategoryAxis>
    <ChartTooltip render={defaultTooltipRender}  />
    <ChartSeries>
        <ChartSeriesItem
            type="column"
            data={performData}
            field="income"
            categoryField="shrtNm"
            name="Income"                               
            labels={{
                visible: false,
                content: labelContent,
            }}
        />

<ChartSeriesItem
            type="column"
            data={performData}
            field="fees"
            name="Fees"
            //categoryField="shrtNm"

            labels={{
                visible: false,
                content: labelContent,
            }}
        />

<ChartSeriesItem
            type="column"
            data={performData}
            field="disbursement"
            categoryField="shrtNm"
            name="Disbursement"
            labels={{
                visible: false,
               // content: labelContent,
            }}
        />

<ChartSeriesItem
            type="column"
            data={performData}
            field="receipt"
            categoryField="shrtNm"
            name="Receipt"
            labels={{
                visible: false,
               // content: labelContent,
            }}
        />

<ChartSeriesItem
            type="column"
            data={performData}
            field="rLGainLoss"
            categoryField="shrtNm"
            name="Realized Gain/Loss"
            labels={{
                visible: false,
               // content: labelContent,
            }}
        />

<ChartSeriesItem
            type="column"
            data={performData}
            field="uLGainLoss"
            categoryField="shrtNm"
            name="Un-Realized Gain/Loss"
            labels={{
                visible: false,
               // content: labelContent,
            }}
        />
    </ChartSeries>
    

    

    

    
</Chart>:
 <Chart 
   
    
 seriesColors={chartDefaultV4Colors} style={{ height: "370px" }}>
     
     <ChartLegend position="bottom" />
     <ChartValueAxis>
                                     <ChartValueAxisItem
                                         // title={{
                                         //     text: "Percentage",
                                         // }}
                                        // min={0}
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
                                                 rotation: 60,
                                                 format: "d",
                                             }}
                                         //  categories={categoryAxis} 
                                         />
                                     </ChartCategoryAxis>
     <ChartTooltip  />
     <ChartSeries>
         <ChartSeriesItem
             type="area"
             data={performData}
             field="income"
             categoryField="shrtNm"
             name="Income"                               
             labels={{
                 visible: false,
                 content: labelContent,
             }}
         />

<ChartSeriesItem
             type="area"
             data={performData}
             field="fees"
             name="Fees"
             //categoryField="shrtNm"

             labels={{
                 visible: false,
                 content: labelContent,
             }}
         />

<ChartSeriesItem
             type="area"
             data={performData}
             field="disbursement"
             categoryField="shrtNm"
             name="Disbursement"
             labels={{
                 visible: false,
                // content: labelContent,
             }}
         />

<ChartSeriesItem
             type="area"
             data={performData}
             field="receipt"
             categoryField="shrtNm"
             name="Receipt"
             labels={{
                 visible: false,
                // content: labelContent,
             }}
         />

<ChartSeriesItem
             type="area"
             data={performData}
             field="rLGainLoss"
             categoryField="shrtNm"
             name="Realized Gain/Loss"
             labels={{
                 visible: false,
                // content: labelContent,
             }}
         />

<ChartSeriesItem
             type="area"
             data={performData}
             field="uLGainLoss"
             categoryField="shrtNm"
             name="Un-Realized Gain/Loss"
             labels={{
                 visible: false,
                // content: labelContent,
             }}
         />
     </ChartSeries>
     

     

     

     
 </Chart>
        
        }

                    </div>

            </div>


        </div>




</div>



           
            { 
           

    localStorage.getItem('changeSelect')==="1"
    ?    
         
 <GridChartMnrAsset data={mnrData} astData={astData} selMjrAsset={''} />:

<GridChartMnrAsset data={updatedMnrDataNew} astData={updatedAssetDataNew} selMjrAsset={selMjrAsset}  />
}
            


































        </div>



    )





}

export default GridMjrAsset
