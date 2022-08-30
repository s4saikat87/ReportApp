import React from 'react'
import { useState,useEffect } from 'react'
import GridChartMnrAsset from './gridChartMnrAsset';
import Loading from './loading';
import { Grid, GridColumn as Column, GridToolbar } from "@progress/kendo-react-grid";
import Enumerable from 'linq';
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
    debugger;
    //const labelContent = (e) => `${e.category}: \n  ${e.value}%`;
    const labelContent = (e) => `${e.value.toFixed(2)}`;
    // const labelContent = (e) => e.category;
    const [mjrPie, setMjrPie] = useState(1);
    const [mjrBar, setMjrBar] = useState(0);
    const [mjrRadioStat, setMjrRadioStat] = useState('checked');
    const [updatedMnrDataNew, setUpdatedMnrDataNew] = useState(mnrData);
    const [updatedAssetDataNew, setUpdatedAssetDataNew] = useState(astData);
    debugger;
    const[changeSelect,setChangeSelect]=useState(JSON.parse(localStorage.getItem('changeSelect')));
    debugger;
    
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

    const handleSetPie = () => {
        setMjrPie(1);
        setMjrBar(0);
        setMjrRadioStat('checked');

    }
    const onRowClick = e => {
        debugger;
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
    if (loading) {
        return <Loading />
    }
    return (


        <div>
            <div className="row mx-1 my-2">
                <div className="col-md-12 card-header tableheader">Major Asset</div>
                <div className="col col-md-6 col-sm-10 py-2">
                    <div className="card rounded">

                        <div className="w-100">
                            <Grid style={{ height: "500px" }}
                                //selectedField="selected"
                                // selectable={{
                                //     enabled: true,
                                //     drag: false,
                                //     cell: false,
                                //     mode: "single",
                                //   }}
                                onRowClick={onRowClick}
                                data={data}
                            // groupable={{
                            //   footer: "visible",
                            // }}
                            // sortable={true}
                            // pageSize={pageSize}
                            //  total={total}
                            //filterable={true}
                            //  onDataStateChange={onDataStateChange}
                            // {...dataState}

                            //  cellRender={cellRender}
                            >

                                <Column field="mjrAstType" menu={true} title="Major Asset" width="220px" />

                                <Column field="mv" title="Market Value($)" cell={NumberCell} headerCell={RightNameHeader} width="210px"  filter="numeric" filterable={false}

                                // footerCell={TotalPaymentCell}
                                />
                                <Column field="mvPercent" cell={NumberCell} headerCell={RightNameHeader} menu={true} title="Market Value(%)" format="{0:n2}" width="150px" />



                            </Grid>
                        </div>

                    </div>
                </div>
                <div className="col col-md-6 col-sm-10 py-2">
                    <div className="card rounded">

                        <div className="">
                            <div className="form-check mt-1 k-text-center py-2 mb-2">
                                <div className="btn-group btn-group-sm" role="group" aria-label="Basic radio toggle button group">
                                    <input type="radio" defaultChecked={mjrRadioStat} className="btn-check form-check-input" name="btnradio" id="radio1" onClick={handleSetPie} />
                                    <label className="btn btn-outline-primary btn-sm" htmlFor="radio1">Pie Chart</label>

                                    <input type="radio" className="btn-check form-check-input" name="btnradio" id="radio2" onClick={handleSetBar} />
                                    <label className="btn btn-outline-primary btn-sm" htmlFor="radio2">Bar Chart</label>




                                </div>
                            </div>
                        </div>

                        {

                            mjrPie === 1
                                ? <Chart style={{ height: "440px" }}>
                                    {/* <ChartTitle text="Major Asset Chart" /> */}
                                    <ChartLegend position="bottom" />

                                    <ChartSeries>
                                        <ChartSeriesItem
                                            type="pie"
                                            data={data}
                                            field="mv"
                                            categoryField="mjrAstType"

                                            labels={{
                                                visible: true,
                                                content: labelContent1,
                                            }}
                                        />
                                    </ChartSeries>
                                </Chart>
                                : <Chart>
                                    {/* <ChartTitle text="Major Asset Chart" /> */}
                                    <ChartLegend position="bottom" />
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
                                    {/* <ChartTooltip   /> */}
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
                        }

                    </div>

                </div>

            </div>

            { 
           

    localStorage.getItem('changeSelect')==="1"
    ?    
         
 <GridChartMnrAsset data={mnrData} astData={astData} />:

<GridChartMnrAsset data={updatedMnrDataNew} astData={updatedAssetDataNew} />
}
            


































        </div>



    )





}

export default GridMjrAsset
