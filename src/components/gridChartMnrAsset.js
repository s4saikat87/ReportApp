import React from 'react'
import { Grid, GridColumn as Column, GridToolbar } from "@progress/kendo-react-grid";
import { useState } from 'react';
import GrdAsset from './grdAsset';
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
const GridChartMnrAsset = ({ data, astData }) => {
    debugger;
    const labelContent = (e) => `${e.value.toFixed(2)}`;
    const defaultTooltipRender = ({ point }) => `${point.value.toFixed(2)}`;
    const [mnrArea, setMnrArea] = useState(0);
    const [mnrBar, setMnrBar] = useState(1);
    const [mnrLine, setMnrLine] = useState(0);
    const [mnrRadioStat, setMnrRadioStat] = useState('checked');
    const [updatedAssetData, setUpdatedAssetData] = useState(astData);
    debugger;
    const [assetFlag, setAssetFlag] = useState(JSON.parse(localStorage.getItem('changeSelect')));
    debugger;
    const handleSetBarMnr = () => {
        setMnrArea(0);
        setMnrBar(1);
        setMnrLine(0);
        setMnrRadioStat('checked');

    }
    const handleSetArea = () => {
        setMnrBar(0);
        setMnrArea(1);
        setMnrLine(0);
        setMnrRadioStat('');
    }

    const handleSetLine = () => {
        setMnrBar(0);
        setMnrArea(0);
        setMnrLine(1);
        setMnrRadioStat('');
    }

    const onRowClick = e => {
        debugger;
        var mnrAsetType = e.dataItem.mnrAstTypId;

        var assetData = Enumerable.from(astData).where(w => w.mnrAstTypId === mnrAsetType)
            .toArray();

        setUpdatedAssetData(assetData);
        localStorage.setItem('changeSelect', "0");
        localStorage.setItem('changeMinor', "1");
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

    return (
        <div>
            <div className="row mx-1 my-2">
                <div className="col-md-12 card-header tableheader">Minor Asset</div>

                <div className="col col-md-6 col-sm-10 py-2">
                    <div className="card rounded">

                        <div className="">

                            <Grid style={{ height: "560px" }}
                                data={data}
                                onRowClick={onRowClick}
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

                                <Column field="mnrAstType" menu={true} title="Minor Asset" width="220px" />

                                <Column field="mv" title="Market Value($)" cell={NumberCell} headerCell={RightNameHeader} width="210px" format="{0:n2}" filter="numeric" filterable={false}

                                // footerCell={TotalPaymentCell}
                                />
                                <Column field="mvPercent" menu={true} cell={NumberCell} headerCell={RightNameHeader} title="Market Value(%)" format="{0:n2}" width="150px" />



                            </Grid>



                        </div>
                    </div>
                </div>

                <div className="col col-md-6 col-sm-10 py-2">
                    <div className="card rounded">
                        <div className="">

                            <div className="form-check mt-1 k-text-center py-2 mb-2">
                                <div className="btn-group btn-group-sm" role="group" aria-label="Basic radio toggle button group">
                                    <input type="radio" defaultChecked={mnrRadioStat} className="btn-check form-check-input" name="btnradioMnr" id="radio1Mnr" onClick={handleSetBarMnr} />
                                    <label className="btn btn-outline-primary btn-sm" htmlFor="radio1Mnr">Bar Chart</label>

                                    <input type="radio" className="btn-check form-check-input" name="btnradioMnr" id="radio2Mnr" onClick={handleSetArea} />
                                    <label className="btn btn-outline-primary btn-sm" htmlFor="radio2Mnr">Area Chart</label>

                                    <input type="radio" className="btn-check form-check-input" name="btnradioMnr" id="radio3Mnr" onClick={handleSetLine} />
                                    <label className="btn btn-outline-primary btn-sm" htmlFor="radio3Mnr">Line Chart</label>



                                </div>
                            </div>


                            {

                                mnrBar === 1
                                    ?

                                    <Chart style={{ height: "500px" }}>
                                        {/* <ChartTitle text="Major Asset Chart" /> */}
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
                                                field="mv"
                                                categoryField="mnrAstType"

                                                labels={{
                                                    visible: false,
                                                    content: labelContent,
                                                }}
                                            />
                                        </ChartSeries>
                                    </Chart>
                                    : mnrArea === 1 ?
                                        <Chart style={{ height: "500px" }}>
                                            {/* <ChartTitle text="Major Asset Chart" /> */}
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
                                                    field="mv"
                                                    categoryField="mnrAstType"

                                                    labels={{
                                                        visible: false,
                                                        content: labelContent,
                                                    }}
                                                />
                                            </ChartSeries>
                                        </Chart>
                                        :
                                        <Chart style={{ height: "500px" }}>
                                            {/* <ChartTitle text="Major Asset Chart" /> */}
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
                                                    type="line"
                                                    data={data}
                                                    field="mv"
                                                    categoryField="mnrAstType"

                                                    labels={{
                                                        visible: false,
                                                        content: labelContent,
                                                    }}
                                                />
                                            </ChartSeries>
                                        </Chart>
                            }


                        </div>
                    </div>
                </div>
            </div>
            {/* <GrdAsset data={astData} /> */}
            {
                localStorage.getItem('changeSelect') === "1"
                    ?
                    <GrdAsset data={updatedAssetData} />
                    :
                 localStorage.getItem('changeMinor') === "1" ?
                    <GrdAsset data={updatedAssetData} />
                    :
                    <GrdAsset data={astData} />
            }
        </div>
    )
}

export default GridChartMnrAsset
