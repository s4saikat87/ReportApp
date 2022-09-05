import React from 'react'
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Grid, GridColumn as Column, GridToolbar } from "@progress/kendo-react-grid";
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
import {
    AutoComplete,
    ComboBox,
    MultiColumnComboBox,
    DropDownList,
    MultiSelect,
    DropDownTree,
} from "@progress/kendo-react-dropdowns";

import { process } from "@progress/kendo-data-query";
import { ExcelExport } from '@progress/kendo-react-excel-export';
import { formatNumber, formatDate } from '@telerik/kendo-intl';
import { ColumnMenu } from "./columnMenu";
import { orderBy } from "@progress/kendo-data-query";
import Loading from './loading';
import { FaSyncAlt } from 'react-icons/fa';
import Enumerable from 'linq';
const AccountProfAssetClass = ({ data, astVsModelData, topHoldData, allmodelData, selModelId, selDrdAcct, loading }) => {

    const [dataAcct, setDataAcct] = React.useState(data.slice());
    const [astModelData, setAstMdlData] = useState(astVsModelData);
    const [topHoldingsData, setTopHoldingsData] = useState(topHoldData);
    const initialSort = [
        {
            field: "groupName",
            dir: "asc",
        },
    ];
    
    const initialModelDropdown = {
        modelId: selModelId,
        modelNm: allmodelData.length > 0 ? (allmodelData.find((ele) => { return ele.modelId === selModelId })).modelNm : ""
    };
    const [selChangeModel, setSelChangeModel] = React.useState([]);

    const [sort, setSort] = React.useState([]);
    const [loadingChild, setLoadingChild] = useState(true);
    const [invMixVal, setInvMixVal] = useState(false);
    const [chartType,setChartType]=useState("pie");
    const[chartTypeLabel,setChartTypeLabel]=useState("");
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


    const labelContent = (e) => `${e.value.toFixed(2)}%`;
    const labelContent1 = (props) => {

        let formatedNumber = Number(props.dataItem.marketPercent).toLocaleString(undefined, {
            style: "percent",
            minimumFractionDigits: 2,
        });
        return `${props.category}  ${props.dataItem.marketPercent.toFixed(2)}%`;
    };

    const labelContentAccVMdl = (props) => {

        let formatedNumber = Number(props.dataItem.mdlWegh).toLocaleString(undefined, {
            style: "percent",
            minimumFractionDigits: 2,
        });
        return `${props.category}  ${props.dataItem.mdlWegh.toFixed(2)}%`;
    };


    const defaultTooltipRender = ({ point }) => `${point.value.toFixed(2)}%`;

    const NumberCell = (props) => {
        return (
            <td style={{ textAlign: 'right' }}>
                {formatNumber(props.dataItem[props.field], "##,#.00")}
            </td>
        )
    }


    const totalSum = (props) => {
        const field = props.field || "";
        const total = dataAcct.reduce((acc, current) => acc + current[field], 0);
        return (
            <td colSpan={props.colSpan} style={{ textAlign: "right" }}>
                {formatNumber(total, "##,#.00")}
            </td>
        );
    };
    const totalAcVMdl = (props) => {
        const field = props.field || "";
        const total = astModelData.reduce((acc, current) => acc + current[field], 0);
        return (
            <td colSpan={props.colSpan} style={{ textAlign: "right" }}>
                {formatNumber(total, "##,#.00")}
            </td>
        );
    };

    const handleChangeAllocModel = (e) => {
        setSelChangeModel(e.target.value);
        // e.preventDefault();

    }

    const handleInvMix = (e) => {
       
        setInvMixVal(e.target.checked)
    }

    const handleModelChange = (e) => {
        
        getChangeInfo(selChangeModel.modelId)
    }

    const getChangeInfo = async (modelId) => {
        setLoadingChild(true);

        let token = JSON.parse(localStorage.getItem('token'));
        let UserId = JSON.parse(localStorage.getItem('userId'));

        let Accounts = "<root> <Account AcctId='" + selDrdAcct + "'/> </root>"

        let AcctId = selDrdAcct;

        let invMix = 0;
        if (invMixVal)
            invMix = 1


        let NumOfRows = 10;

        
        const postData = { UserId, Accounts, modelId, invMix, NumOfRows, AcctId };
        const config = {
            headers: {
                'authorization': `Bearer ${token.token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }

        };
        await axios.post('/AccountProfile',
            postData,
            config
        )
            .then(response => {

                //  console.log(response);
              
                const rowData = response.data[0];
                const acctProfData = rowData.accountProf.ocAcctProfile;
                setDataAcct(acctProfData);
                const assetVsModelData = rowData.assetAllocVsMod.ocAssetAllocVsModel;
                setAstMdlData(assetVsModelData);
                const topHoldingsData = rowData.topHold.ocTopHolding;
                setTopHoldingsData(topHoldingsData);
                //    setAcctProfileRptData(acctProfData);
                //    setAcctPortVsModelData(assetVsModelData);
                //    setTopHoldingData(topHoldingsData);
                //  setAcctUpdateStat(1);

                setLoadingChild(false);



            })
            .catch((error) => {

                return error;
            });


    }




    useEffect(() => {
        // Good!
        debugger;
        setSelChangeModel(initialModelDropdown);
        setLoadingChild(false);
       // setChartTypeLabel(labelContent1);
        // Side-effect!
    }, []);
   

    // if (loading) {
    //     return <Loading />
    // }
    // else
    if (loadingChild)
        return <Loading />
    else
        return (
            <div>
                <div className="mx-2 my-2">
                    <div className="col-md-12 card-header tableheader">Account Summary</div>
                </div>
                <div className="container-fluid">
                    <div className="row text-center"></div>
                    <Grid style={{ height: "330px" }}
                        data={orderBy(dataAcct.slice(), sort)}
                        sortable={true}
                        sort={sort}
                        onSortChange={(e) => {
                            setSort(e.sort);
                        }}
                    >

                        <Column field="groupName" menu={true} title="Asset Class" width="400px" />
                        <Column field="txCstAmt" menu={true} title="Total Cost($)" width="180px" footerCell={totalSum} columnMenu={ColumnMenu} cell={NumberCell} headerCell={RightNameHeader} />
                        <Column field="market" menu={true} title="Market Value($)" width="180px" footerCell={totalSum} columnMenu={ColumnMenu} cell={NumberCell} headerCell={RightNameHeader} />

                        <Column field="income" menu={true} title="Income($)" width="180px" footerCell={totalSum} columnMenu={ColumnMenu} cell={NumberCell} headerCell={RightNameHeader} />

                        <Column field="yield" menu={true} title="Yield(%)" width="180px" columnMenu={ColumnMenu} cell={NumberCell} headerCell={RightNameHeader} />
                        <Column field="marketPercent" title="Market Value(%)" width="180px" footerCell={totalSum} columnMenu={ColumnMenu} cell={NumberCell} headerCell={RightNameHeader} />


                    </Grid>

                </div>



                <div className="row mx-1 my-2 pb-3 mb-5">

                    <div className="col col-md-6 col-sm-10 py-2">
                        <div className="col-md-12 card-header tableheader">Account Holdings  </div>
                        <div className="card rounded h-100">

                            <div className="w-100">
                                <Chart style={{ height: "440px" }}>
                                    {/* <ChartTitle text="Major Asset Chart" /> */}
                                    <ChartLegend position="bottom" />

                                    <ChartSeries>
                                        <ChartSeriesItem
                                            type={chartType}
                                            data={dataAcct}
                                            field="marketPercent"
                                            categoryField="groupName"

                                            labels={{
                                                visible: true,
                                                content: labelContent1,
                                            }}
                                        />
                                    </ChartSeries>
                                </Chart>

                            </div>
                        </div>
                    </div>

                    <div className="col col-md-6 col-sm-10 py-2">
                        <div className="col-md-12 card-header tableheader">Allocation Model

                        </div>
                        
                        <div className="card rounded h-100">

                            <Chart style={{ height: "440px" }}>
                                {/* <ChartTitle text="Major Asset Chart" /> */}
                                <ChartLegend position="bottom" />

                                <ChartSeries>
                                    <ChartSeriesItem
                                        type="pie"
                                        data={astModelData}
                                        field="mdlWegh"
                                        categoryField="descption"

                                        labels={{
                                            visible: true,
                                            content: labelContentAccVMdl,
                                        }}
                                    />
                                </ChartSeries>
                            </Chart>
                            <hr></hr>


                            <div className='row my-1'>
                            <div className='col text-left mx-2 my-1'>
                                <DropDownList
                                    style={{
                                        width: "320px",
                                    }}
                                    data={allmodelData}
                                    textField="modelNm"
                                    valueField="modelId"
                                    dataItemKey="modelId"
                                    filterable={false}
                                    disabled={invMixVal}
                                    //defaultItem={initialModelDropdown}
                                    value={selChangeModel}
                                    onChange={handleChangeAllocModel}

                                />
                            </div>
                            <div className='col mx-2 my-1'><button className='btn btn-secondary' onClick={handleModelChange} name='btnRefresh'><FaSyncAlt /></button></div>
                            </div>
                            <div className='row my-1 mx-2'>
                            <div className='form-check' >

                               
                                <input className='form-check-input' type='checkbox' name='chkInvTrgMix' checked={invMixVal} onChange={handleInvMix} ></input>
                                <label className='form-check-label'>Compare against Investment Target Mix </label>  
                            
                        </div>
                        </div>
                        </div>

                    </div>

                </div>











                <div className="row mx-1 my-2">
                    <div className="col-md-12 card-header tableheader">Portfolio vs Model </div>
                    <div className="col col-md-12 col-sm-12 py-2">
                        <div className="card rounded">

                            <div className="w-100">
                                <Chart
                                    zoomable={false}
                                >
                                    <ChartValueAxis>
                                        <ChartValueAxisItem
                                            // title={{
                                            //     text: "Percentage",
                                            // }}
                                            min={0}
                                            max={100}
                                        />
                                    </ChartValueAxis>
                                    <ChartCategoryAxis>
                                        <ChartCategoryAxisItem
                                            labels={{
                                                visible: true,
                                                rotation: "auto",
                                                format: "d",

                                            }}

                                        //  categories={categoryAxis} 
                                        />
                                    </ChartCategoryAxis>
                                    <ChartSeriesDefaults
                                        type="column"
                                        labels={{
                                            visible: true,
                                            format: "n2",
                                        }}
                                    />

                                    {/* <ChartValueAxis>
                    <ChartValueAxisItem crosshair={crosshair} />
                </ChartValueAxis> */}
                                    <ChartTooltip render={defaultTooltipRender} />


                                    <ChartSeries>

                                        <ChartSeriesItem
                                            data={astModelData}
                                            type='column'
                                            field='prtfolioWeigh'
                                            categoryField='descption'
                                            // aggregate='sum'
                                            labels={{
                                                visible: true,
                                                content: labelContent,
                                            }}

                                        />

                                        <ChartSeriesItem
                                            data={astModelData}
                                            type='column'
                                            field='mdlWegh'
                                            categoryField='descption'
                                            // aggregate='sum'
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


                <div className="row mx-1 my-2">
                    <div className="col-md-12 card-header tableheader">Portfolio vs Model Summary </div>
                    <div className="col col-md-12 col-sm-12 py-2">
                        <div className="card rounded">

                            <div className="w-100">

                                <Grid style={{ height: "240px" }}
                                    data={astModelData}
                                //sortable={true}
                                // sort={sort}
                                // onSortChange={(e) => {
                                //     setSort(e.sort);
                                // }}
                                >

                                    <Column field="descption" menu={true} title="Description" width="250px" />
                                    <Column field="prtfolio" menu={true} title="Portfolio($)" width="180px" footerCell={totalAcVMdl} columnMenu={ColumnMenu} cell={NumberCell} headerCell={RightNameHeader} />
                                    <Column field="prtfolioWeigh" menu={true} title="Portfolio(%)" width="150px" footerCell={totalAcVMdl} columnMenu={ColumnMenu} cell={NumberCell} headerCell={RightNameHeader} />

                                    <Column field="mdl" menu={true} title="Model($)" width="180px" footerCell={totalAcVMdl} columnMenu={ColumnMenu} cell={NumberCell} headerCell={RightNameHeader} />

                                    <Column field="mdlWegh" menu={true} title="Model(%)" width="150px" footerCell={totalAcVMdl} columnMenu={ColumnMenu} cell={NumberCell} headerCell={RightNameHeader} />
                                    <Column field="varitoMdl_Amt" menu={true} title="Variance($)" width="180px" footerCell={totalAcVMdl} columnMenu={ColumnMenu} cell={NumberCell} headerCell={RightNameHeader} />
                                    <Column field="varitoMdl" menu={true} title="Variance(%)" width="150px" footerCell={totalAcVMdl} columnMenu={ColumnMenu} cell={NumberCell} headerCell={RightNameHeader} />
                                </Grid>
                            </div>
                        </div>
                    </div>



                </div>



                <div className="row mx-1 my-2">
                    <div className="col-md-12 card-header tableheader">Top Holdings </div>
                    <div className="col col-md-12 col-sm-12 py-2">
                        <div className="card rounded">

                            <div className="w-100">

                                <Grid style={{ height: "480px" }}
                                    data={topHoldingsData}
                                //sortable={true}
                                // sort={sort}
                                // onSortChange={(e) => {
                                //     setSort(e.sort);
                                // }}
                                >

                                    <Column field="tickerCusipConcate" menu={true} title="Ticker/Cusip : Asset" width="450px" />
                                    <Column field="shares" menu={true} title="Shares" width="200px" columnMenu={ColumnMenu} cell={NumberCell} headerCell={RightNameHeader} />
                                    <Column field="txcstAmt" menu={true} title="Total Cost($)" width="200px" columnMenu={ColumnMenu} cell={NumberCell} headerCell={RightNameHeader} />

                                    <Column field="market" menu={true} title="Market Value($)" width="200px" columnMenu={ColumnMenu} cell={NumberCell} headerCell={RightNameHeader} />

                                    <Column field="marketPercent" menu={true} title="Percentage(%)" width="200px" columnMenu={ColumnMenu} cell={NumberCell} headerCell={RightNameHeader} />

                                </Grid>
                            </div>
                        </div>
                    </div>



                </div>







            </div>

        )
}

export default AccountProfAssetClass
