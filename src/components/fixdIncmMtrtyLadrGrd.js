import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Grid, GridColumn as Column, GridToolbar } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import { ExcelExport } from '@progress/kendo-react-excel-export';
import Moment from 'react-moment';
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
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Enumerable from 'linq';
import FixdIncmMaturityLadrCallDetls from './fixdIncmMtrtyLadrCallDetls';

const aggregates = [
    {
      field: "shares",
      aggregate: "sum",
    },
    {
        field: "market",
        aggregate: "sum",
    },
    {
        field: "income",
        aggregate: "sum",
    },
    {
        field: "marketPercent",
        aggregate: "sum",
    },
    {
        field: "yield",
        aggregate: "average",
    }
  
  ];
  const initialGroup = [
    {
      field: "accountNumber",
    }  
  ];

  const initialDataState = {
    skip: 0,
  take: 10,
  };

  const processWithGroups = (data, dataState) => {
    const newDataState = process(data, dataState);
    setGroupIds({
      data: newDataState.data,
      group: dataState.group,
    });
    return newDataState;
  };
const FixdIncmMaturityLadrGrd = ({data, callDetails, matVsCallPut}) => {
  
    const _export = React.useRef(null);
    const _grid = React.useRef();
    const excelExport = () => {
    if (_export.current !== null) {
        _export.current.save(data);
    }
  };


  const totalSum = (props) => {
    const field = props.field || "";
    const total = data.reduce((acc, current) => acc + current[field], 0);
    return (
      <td colSpan={props.colSpan} style={{textAlign:"right"}}>
       { formatNumber(total, "##,#.00")}
        
      </td>
    );
  };
  const totalPercent = (props) => {
    const field = props.field || "";
    const total = data.reduce((acc, current) => acc + current[field], 0)*100;
    return (
      <td colSpan={props.colSpan} style={{textAlign:"right"}}>
       { formatNumber(total, "##,#.00")}
        
      </td>
    );
  };
  const avgYield = (props) => {
    
    const field = props.field;
    const len=data.length;
    const average = data.reduce((acc, current) => acc + current[field],0)/len;
    return (
      <td colSpan={props.colSpan} style={{textAlign:"right"}}>
        Avg: { formatNumber(average, "##,#.00")}
      </td>
    );
  }; 
  const ftrText = (props) => {
    
    return (
      <td colSpan={2} style={{textAlign:"left"}}>
        Total Fixed Income Portfolio
      </td>
    );
  };

  
  const [row, setRow] = useState(data);
  const [dataState, setDataState] = React.useState();
  const [resultState, setResultState] = React.useState(
    processWithGroups(row, initialDataState)
  );
  //setResultState(process({data}, initialDataState))
  const[ChkBoxState,setChkBoxState]=useState(false);
  const [page, setPage] = React.useState(initialDataState);
  const [collapsedState, setCollapsedState] = React.useState([]);
  const [chartData, setSelectedData] = React.useState(data);
  const [callData, setCallDetails] = React.useState(callDetails);
  const [chartmatVsCallPutData, setmatVsCallPutData] = React.useState(matVsCallPut);
  const [callFlag, setCallFlag]=useState(0);
  
  const onDataStateChange = React.useCallback((e) => {
 
    
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
const PercentCell = (props) => {
  //debugger;
  if (props.rowType === "data")
  {
  let mc=props.dataItem[props.field];
  let reslt=mc*100;
    
  return (      
    <td style={{ textAlign: 'right' }}>
        {formatNumber((props.dataItem[props.field]*100), "##,#.00")}
    </td>      
)
  }
}
const IntCell = (props) => {
  return (
      <td style={{ textAlign: 'right' }}>
          {props.dataItem[props.field]}
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
    
    if (cellProps.rowType === "data")
    {

    if(cellProps.field==="shares")
      {
        return (
         
          <td aria-colindex={cellProps.columnIndex} style={{ textAlign: 'right' }}  role={"gridcell"}>
            { formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
          </td>
      );
      }
      if(cellProps.field==="market")
      {
        return (
          
          <td aria-colindex={cellProps.columnIndex} style={{ textAlign: 'right' }}  role={"gridcell"}>
            { formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
          </td>          
      );
      }
      if (cellProps.field === "income") {

        return (
          <td aria-colindex={cellProps.columnIndex} style={{ textAlign: 'right' }}  role={"gridcell"}>
            { formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
          </td>
        );
      }
      if(cellProps.field==="marketPercent")
      {
       // debugger;
        let mb=100;
        let mc=cellProps.dataItem[cellProps.field];
        return (
          
          <td aria-colindex={cellProps.columnIndex} style={{ textAlign: 'right' }} role={"gridcell"}>
            { formatNumber(mc*mb, "##,#.00")}
          </td>          
      );
      }
      if (cellProps.field === "yield") {

        return (
          <td aria-colindex={cellProps.columnIndex} style={{ textAlign: 'right' }} role={"gridcell"}>
            { formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
          </td>
        );
      }
    
    if(cellProps.field==="mtrtyYr")
    {
      return (
        <td aria-colindex={cellProps.columnIndex} role={"gridcell"}>
          Bonds Maturing In&nbsp;{ formatNumber(cellProps.dataItem[cellProps.field], "###")}
        </td>
    );
    }
  }

    if (cellProps.rowType === "groupFooter") {

      if (cellProps.field === "shares") {

        return (
          <td aria-colindex={cellProps.columnIndex} style={{ textAlign: 'right' }}  role={"gridcell"}>
            { formatNumber(cellProps.dataItem.aggregates.shares.sum, "##,#.00")}
          </td>
        );
      }
      if (cellProps.field === "market") {

        return (
          <td aria-colindex={cellProps.columnIndex} style={{ textAlign: 'right' }}  role={"gridcell"}>
            { formatNumber(cellProps.dataItem.aggregates.market.sum, "##,#.00")}
          </td>
        );
      }
      if (cellProps.field === "income") {

        return (
          <td aria-colindex={cellProps.columnIndex} style={{ textAlign: 'right' }}  role={"gridcell"}>
            { formatNumber(cellProps.dataItem.aggregates.income.sum, "##,#.00")}
          </td>
        );
      }
      if (cellProps.field === "marketPercent") {

        return (
          <td aria-colindex={cellProps.columnIndex} style={{ textAlign: 'right' }} role={"gridcell"}>
            { formatNumber((cellProps.dataItem.aggregates.marketPercent.sum*100), "##,#.00")}
          </td>
        );
      }
      
      if (cellProps.field === "yield") {

        return (
          <td aria-colindex={cellProps.columnIndex} style={{ textAlign: 'right' }} role={"gridcell"}>
           Avg:&nbsp;{ formatNumber((cellProps.dataItem.aggregates.yield.average), "##,#.00")}
          </td>
        );
      }
      if(cellProps.field==="accountNumber")
    {
      return (
        <td aria-colindex={cellProps.columnIndex} colSpan={2} role={"gridcell"}>
          Total Fixed Income Portfolio
        </td>
    );
    }
    }

    return tdElement;
  };

  const ShowCallPutDetails=(e)=>{
    setChkBoxState(e.target.checked);
    const groups = e.dataState.group;

    if (groups) {
      groups.map((group) => (group.aggregates = aggregates));
    }
    e.dataState.group = groups;
    setResultState( processWithGroups(row,e.dataState));
    setDataState(e.dataState);
  };
  
  const pageChange = (event) => {
    setPage(event.page);
  };

  const onExpandChange = React.useCallback(
    (event) => {
      
      const item = event.dataItem;

      if (item.groupId) {
        const newCollapsedIds = !event.value
          ? [...collapsedState, item.groupId]
          : collapsedState.filter((groupId) => groupId !== item.groupId);
          
        setCollapsedState(newCollapsedIds);
      }
    },
    [collapsedState]
  );

  const newData = setExpandedState({
    data: resultState.data,
    collapsedIds: collapsedState,
  });
  const defaultTooltipRender = ({ point }) => `${formatNumber(point.value, "##,#.00")}`;
  const labelContent = (e) => `$${formatNumber(e.value, "##,#.00")}`;
  const labelContent1 = (props) => {

    let formatedNumber = Number(props.dataItem.mvPercent).toLocaleString(undefined, {
        style: "percent",
        minimumFractionDigits: 2,
    });
    return `${props.category}  ${props.dataItem.mvPercent.toFixed(2)}%`;
};

  const onRowClick = e => {
   //debugger;
    var myr = e.dataItem.acctId;

    var acctData = Enumerable.from(data).where(w => w.acctId === myr)
        .toArray();

    setSelectedData(acctData);
    var calData = Enumerable.from(callDetails).where(w => w.acctId === myr)
    .toArray();
    setCallDetails(calData);
    var mVsCData = Enumerable.from(matVsCallPut).where(w => w.acctId === myr)
    .toArray();
    setmatVsCallPutData(mVsCData);
    setCallFlag(1);    
   
    setResultState(processWithGroups(data,e.dataState));
    setDataState(e.dataState);
    
    
    //var Data = mnrData.find((mjrTypeDtls) => mjrTypeDtls.mjrAstTypId === mjrAsetType);
    //console.log( Data);

};

const FormatLongNumber=({value})=> {
       
  if(value === 0) {
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

  return (
    
    <div>
        <div className="card mx-2 my-2">
            <div className="card-header tableheader">Fixed Income Maturity Ladder Report</div>
        </div>
        
        
        <div className="container-fluid">
        <div className="row text-center">
        
        <ExcelExport data={resultState} ref={_export}> 
       <Grid style={{ height: "450px" }}
            data={newData}
            onRowClick={onRowClick}
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
           
            ref={_grid}
           // total={total}
           // filterable={true}
           resizable={true}
           reorderable={true}
           onDataStateChange={onDataStateChange}
           {...dataState}
           onExpandChange={onExpandChange}
           expandField="expanded"
            cellRender={cellRender}
          >
            <GridToolbar>
          <button
            title="Export Excel"
            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
            onClick={excelExport}
          >
            Export to Excel
          </button>
          <FormGroup>
      <FormControlLabel control={<Checkbox name='chkShwMtrtyCall' onChange={ShowCallPutDetails}/>} label="Show Call Details" />
    </FormGroup>
        </GridToolbar>
            <Column field="accountNumber" menu={true} title="Account Number" columnMenu={ColumnMenu}  width="150px"  footerCell={ftrText} />
            <Column field="accountName" menu={true} title="Account Name" columnMenu={ColumnMenu}  width="170px"  />
            <Column field="mtrtyYr" menu={true}  title="Description(Based On Maturity Date)" width="300px" columnMenu={ColumnMenu} />
            
            <Column field="shares" title="Par Value" width="150px" filter="numeric" format="{0:n2}" columnMenu={ColumnMenu} headerCell={RightNameHeader}  filterable={false} footerCell={totalSum}/>
            <Column field="market" title="Market Value" width="150px" format="{0:n2}" filter="numeric" columnMenu={ColumnMenu} headerCell={RightNameHeader}   filterable={false} footerCell={totalSum}/>
            <Column field="income" title="Income" width="150px" format="{0:n2}" filter="numeric" columnMenu={ColumnMenu} headerCell={RightNameHeader}  filterable={false} footerCell={totalSum}/>
            <Column field="yield" title="Yield%" width="120px" filter="numeric" format="{0:n2}" columnMenu={ColumnMenu} headerCell={RightNameHeader}   filterable={false} footerCell={avgYield}/>
            <Column field="marketPercent" title="Percent" width="120px" filter="numeric" format="{0:n2}" columnMenu={ColumnMenu}  headerCell={RightNameHeader}  filterable={false} />
                        
          </Grid>
         {!ChkBoxState?
         
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
                                        {/* <ChartTooltip render={defaultTooltipRender} /> */}
                                        <ChartValueAxis>
                                        <ChartValueAxisItem
                                            // title={{
                                            //     text: "Percentage",
                                            // }}
                                            min={0}
                                           labels={{
                                            visible: true,
                                           content:FormatLongNumber
                                         
                                        }}
                                        />
                                    </ChartValueAxis>
                                        <ChartSeries>
                                            <ChartSeriesItem
                                                type="column"
                                                data={chartData}
                                                field="shares"
                                                categoryField="mtrtyYr"

                                                labels={{
                                                    visible: true,
                                                    content: labelContent,
                                                }}
                                            />
                                        </ChartSeries>
                                    </Chart>
:
<div></div>
}
<div style={{width:"60%",float:"left"}}>
  {callFlag===1?
                                    <FixdIncmMaturityLadrCallDetls data={callData} chkState={ChkBoxState} />
                                    :
                                    <FixdIncmMaturityLadrCallDetls data={callDetails} chkState={ChkBoxState} />
                                    }
                                    </div>
                                    {ChkBoxState?
                                    
                                    <div className="card mx-2 my-2" style={{width:"38%",float:"left"}}>
            <div className="card-header tableheader">Maturity Date Vs Call / Put Date</div>
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
                                        <ChartValueAxis>
                                        <ChartValueAxisItem
                                            // title={{
                                            //     text: "Percentage",
                                            // }}
                                            min={0}
                                           labels={{
                                            visible: true,
                                           content:FormatLongNumber
                                         
                                        }}
                                        />
                                    </ChartValueAxis>
                                        <ChartSeries>
                                            <ChartSeriesItem
                                                type="column"
                                                data={chartmatVsCallPutData}
                                                categoryField="callOrPutYr"
                                                field="mtrShares"
                                                labels={{
                                                    visible: false,
                                                    content: labelContent,
                                                }}
                                            />
                                            <ChartSeriesItem
                                                type="column"
                                                data={chartmatVsCallPutData}
                                                categoryField="callOrPutYr"
                                                field="callPutShares"
                                                labels={{
                                                    visible: false,
                                                    content: labelContent,
                                                }}
                                            />
                                        </ChartSeries>
                                    </Chart>
        </div>
        :
        <div></div>
}                         
          </ExcelExport>   

          </div>
          </div>
    </div>
  )
}

export default FixdIncmMaturityLadrGrd