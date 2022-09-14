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
const GridMjrAsset = ({ data, mnrData, astData, loading }) => {
   
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
        "#014ce6",
    "#9b9eb2",
    "#bbbdcc",
    "#505465",
    "#d8dbe5",
    "#f4f4f2",
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
        return `${props.category}  ${props.dataItem.mvPercent.toFixed(2)}%`;
    };
    const defaultTooltipRender = ({ point }) => `${point.value.toFixed(2)}`;

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



    if (loading) {
        return <Loading />
    }
    return (


        <div>




            <div className="row mx-1 my-2">
                <div className='card rounded'>

                    <div className='card-header'>

                    <div className='tableheader text-start'>Major Asset</div>
                    
                    </div>

    <div className='card-body row'>                    
     <div className="col h-100">
    <Chart onSeriesClick={plotareaclick}
     seriesColors={chartDefaultV4Colors} style={{ height: "350px" }}>
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
    
    <div className='col h-100'>
    <Chart 
    onSeriesClick={plotareaclick}
    
    seriesColors={chartDefaultV4Colors} style={{ height: "350px" }}>
        {/* <ChartTitle text="Major Asset Chart" /> */}
        <ChartLegend position="right" />
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
        {/* <ChartTooltip  /> */}
        <ChartSeries>
            <ChartSeriesItem
                type="column"
                data={data}
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
