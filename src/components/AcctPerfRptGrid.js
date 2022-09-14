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
import { textAlign } from '@mui/system';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
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
      field: "shares",
      aggregate: "sum",
    },
    {
        field: "market",
        aggregate: "sum",
    },
    {
        field: "yield",
        aggregate: "average",
    }
  
  ];
  const initialGroup = [
    {
      field: "extrnlAcctId",
    }  
  ];

  const initialDataState = {
    skip: 0,
  take: 20,
  };

  const processWithGroups = (data, dataState) => {
    debugger;
    const newDataState = process(data, dataState);
    setGroupIds({
      data: newDataState.data,
      group: dataState.group,
    });
    return newDataState;
  };
const AcctPerfRptGrid = ({data, alloc}) => {
    debugger;
    const _export = React.useRef(null);
    const _grid = React.useRef();
    const excelExport = () => {
    if (_export.current !== null) {
        _export.current.save(data);
    }
  };


  // const totalSum = (props) => {
  //   const field = props.field || "";
  //   const total = data.reduce((acc, current) => acc + current[field], 0);
  //   return (
  //     <td colSpan={props.colSpan} style={{textAlign:"right"}}>
  //      { formatNumber(total, "##,#.00")}
        
  //     </td>
  //   );
  // };
  // const avgYield = (props) => {
  //   //debugger;
  //   const field = props.field;
  //   const len=data.length;
  //   const average = data.reduce((acc, current) => acc + current[field],0)/len;
  //   return (
  //     <td colSpan={props.colSpan} style={{textAlign:"right"}}>
  //       Avg: { formatNumber(average, "##,#.00")}
  //     </td>
  //   );
  // }; 

  
  const [row, setRow] = useState(data);
  const [dataState, setDataState] = React.useState();
  const [resultState, setResultState] = React.useState(
    processWithGroups(row, initialDataState)
  );
  //setResultState(process({data}, initialDataState))
  
  const [page, setPage] = React.useState(initialDataState);
  const [collapsedState, setCollapsedState] = React.useState([]);
  const[ChkBoxState,setChkBoxState]=useState(true);
  const [rorData, setRorData] = React.useState(alloc);

  const onDataStateChange = React.useCallback((e) => {
 
    
    {
    //let gridData = data;
    const groups = e.dataState.group;

    if (groups) {
      groups.map((group) => (group.aggregates = aggregates));
    }
  e.dataState.group = groups;}
   setResultState( processWithGroups(row,e.dataState));
   setDataState(e.dataState);
   //setChkBoxState(true);
  }, []);

  const NumberCell = (props) => {
    return (
        <td style={{ textAlign: 'right' }}>
            {formatNumber(props.dataItem[props.field], "##,#.00")}
        </td>
    )
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
    
    
    // if (cellProps.rowType === "data")
    // {
    // let cpnRate="", matrtyDate="";

    // if(cellProps.field==="yldToMtrty" || cellProps.field==="yldCalPut")
    //   {
    //     return (
    //       (ChkBoxState===true)?
    //       <>
    //       <td aria-colindex={cellProps.columnIndex} role={"gridcell"}>
    //         { formatNumber(cellProps.dataItem["yldToMtrty"], "##,#.00")}
    //       </td>
    //       </>:
    //       <>
    //       <td aria-colindex={cellProps.columnIndex} role={"gridcell"}>
    //         { formatNumber(cellProps.dataItem["yldCalPut"], "##,#.00")}
    //       </td>
    //       </>
    //   );
    //   }
      // if(cellProps.field==="duration" || cellProps.field==="calPutDuration")
      // {
      //   return (
      //     (ChkBoxState===true)?
      //     <>
      //     <td aria-colindex={cellProps.columnIndex} role={"gridcell"}>
      //       { formatNumber(cellProps.dataItem["duration"], "##,#.00")}
      //     </td>
      //     </>:
      //     <>
      //     <td aria-colindex={cellProps.columnIndex} role={"gridcell"}>
      //       { formatNumber(cellProps.dataItem["calPutDuration"], "##,#.00")}
      //     </td>
      //     </>
      // );
      // }
    
    // if(cellProps.field==="maturityDt")
    // {
      
    //   const value = cellProps.field;      
    //   return (
    //       <td aria-colindex={cellProps.columnIndex} role={"gridcell"}>
           
    //           <Moment format="MM/DD/YYYY">
    //           {cellProps.dataItem[value]}
    //         </Moment>
    //       </td>
    //   );
    // }
    // if(cellProps.field==="astShrtNm")
    // {
    //   cpnRate=cellProps.dataItem["couponRate"];
    //   matrtyDate=cellProps.dataItem["maturityDt"];
    //   return (
    //     <td aria-colindex={cellProps.columnIndex} role={"gridcell"}>
    //       {cellProps.dataItem[cellProps.field]}&nbsp;{ formatNumber(cpnRate, "##,#.00")}%&nbsp;
    //         <Moment format="MM/DD/YYYY">
    //         {matrtyDate}
    //       </Moment>
    //       &nbsp;
    //     </td>
    // );
    // }
  // }

    
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
  const defaultTooltipRender = ({ point }) => `${point.value.toFixed(2)}`;
  const labelContent = (e) => `${e.value.toFixed(2)}`;
  return (
    
    <div>
        <div className="card mx-2 my-2">
            <div className="card-header tableheader">Account Performance</div>
        </div>
        
        
        <div className="container-fluid">
        <div className="row text-center">
       
        <ExcelExport data={resultState} ref={_export}> 
       <Grid style={{ height: "650px" }}
            data={newData}
            // data={resultState.slice(page.skip, page.skip + page.take)}
            groupable={{
              footer: "visible",
            }}

           
            sortable={true}
            skip={page.skip}
            pageable={ true}
            pageSize={page.take}
            total={data.length}
           
            ref={_grid}
           //total={total}
          //  filterable={true}
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
          
        </GridToolbar>
            <Column field="extrnlAcctId" menu={true} title="Account Number" columnMenu={ColumnMenu} locked={true} width="170px"  />
            <Column field="shrtNm" menu={true} title="Account Name" columnMenu={ColumnMenu} locked={true} width="200px"  />
            <Column field="startMarket" menu={true} title="Start Market" columnMenu={ColumnMenu} cell={NumberCell} width="170px"  />
            <Column field="receipt"  title="Admin Receipts" columnMenu={ColumnMenu} cell={NumberCell} width="170px" format="{0:n2}"  />
            <Column field="disbursement"  title="Disbursements" columnMenu={ColumnMenu} cell={NumberCell} width="170px" format="{0:n2}" />
            <Column field="income"   title="Earned Income" width="170px" columnMenu={ColumnMenu} cell={NumberCell} format="{0:n2}" />
            <Column field="rlGainLoss"  title="Realized Gain/Loss" width="170px" columnMenu={ColumnMenu} cell={NumberCell} format="{0:n2}" />
            <Column field="ulGainLoss"  title="Unrealized Gain/Loss" width="170px" columnMenu={ColumnMenu} cell={NumberCell} format="{0:n2}" />
            <Column field="endMarket"  title="End Market" width="170px" columnMenu={ColumnMenu} cell={NumberCell} format="{0:n2}" />

            
            
          </Grid>
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
                                        <ChartSeries>
                                            <ChartSeriesItem
                                                type="column"
                                                data={alloc}
                                                categoryField="assetType"
                                                field="startPercent"
                                                labels={{
                                                    visible: false,
                                                    content: labelContent,
                                                }}
                                            />
                                            <ChartSeriesItem
                                                type="column"
                                                data={alloc}
                                                categoryField="assetType"
                                                field="endPercent"
                                                labels={{
                                                    visible: false,
                                                    content: labelContent,
                                                }}
                                            />
                                        </ChartSeries>
                                    </Chart>
         
          </ExcelExport>   

   

          </div>
          </div>
    </div>
  )
}

export default AcctPerfRptGrid