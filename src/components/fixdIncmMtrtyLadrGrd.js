import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Grid, GridColumn as Column, GridToolbar } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import { ExcelExport } from '@progress/kendo-react-excel-export';
import Moment from 'react-moment';
import { formatNumber, formatDate  } from '@telerik/kendo-intl';
import { CustomColumnMenu } from './customColumnMenu';
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
    const groups = dataState.group;

    /*if (groups) {
      groups.map((group) => (group.aggregates = aggregates));
    }*/
  
    dataState.group = groups;
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
      // debugger;
    if (_export.current !== null) {
        _export.current.save(data);
    }
  };

  const [locked, setLocked] = React.useState(false);

  const columnLocked = () => {
    setLocked(!locked);
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

  const columns = [
    {
      title: 'Account Number',
      field: 'accountNumber',
      minWidth: 150,
      show: true,
      filter: 'text',
      locked: true,
    },
    {
      title: 'Account Name',
      field: 'accountName',
      minWidth: 170,
      show: true,
      filter: 'text',
      locked: true,
    },
    {
      title: 'Description(Based On Maturity Date)',
      field: 'mtrtyYr',
      minWidth: 300,
      show: true,
      filter: 'text',
      locked: true
    },
    {
      title: 'Par Value',
      field: 'shares',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
      // footerCell: totalSum,
      headerCell:RightNameHeader,
    },
    {
      title: 'Market Value',
      field: 'market',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
      // footerCell: totalSum,
      headerCell:RightNameHeader,  
    },
    {
      title: 'Income',
      field: 'income',
      minWidth: 150,
      show: true,
      filter: 'numeric',
      locked: false,
      // footerCell: totalSum,
      headerCell:RightNameHeader,
    },
    {
      title: 'Yield%',
      field: 'yield',
      minWidth: 120,
      show: true,
      filter: 'numeric',
      locked: false,
      // footerCell: avgYield,
      headerCell:RightNameHeader,
    },
    {
      title: 'Percent',
      field: 'marketPercent',
      minWidth: 120,
      show: true,
      filter: 'numeric',
      locked: false,
      headerCell:RightNameHeader,
    }
  ];
  
  const [row, setRow] = useState(data);
  const createDataState = (dataState) => {
    return {
      result: process(data.slice(0), dataState),
      dataState: dataState,
    };
  };
  let initialState = createDataState({
    take: 20,
    skip: 0,
    // group: [
    //   {
    //     field: 'accountName',
    //   },
    // ],
  });
  const [dataState, setDataState] = React.useState(initialState.dataState);
  const [resultState, setResultState] = React.useState(
    processWithGroups(data, initialState.dataState)
  );
  const [stateColumns, setStateColumns] = React.useState(columns);
  const [currentColumns, setCurrentColumns] = React.useState(columns);
  //setResultState(process({data}, initialDataState))
  const[ChkBoxState,setChkBoxState]=useState(false);
  let pageSize = 10;
  const [page, setPage] = React.useState({
    skip: 0,
    take: pageSize,
  });
  const [collapsedState, setCollapsedState] = React.useState([]);
  const [chartData, setSelectedData] = React.useState(data);
  const [callData, setCallDetails] = React.useState(callDetails);
  const [chartmatVsCallPutData, setmatVsCallPutData] = React.useState(matVsCallPut);
  const [callFlag, setCallFlag]=useState(0);
  
  const onDataStateChange = (event) => {
    let updatedState = createDataState(event.dataState);

    setResultState(processWithGroups(data, updatedState.dataState));

    setDataState(updatedState.dataState);
  };

  const onColumnsSubmit = (columnsState) => {
    setStateColumns(columnsState);
  };
  const setWidth = (minWidth) => {
    let width = minWidth;
    return width;
  };

  const handleColumnLockToggle = (columnField, state) => {
    let newColumns = currentColumns.map((column) => {
      if (column.field === columnField) {
        column.locked = state;
      }

      return column;
    });
    setCurrentColumns(newColumns);
  }; // place all locked columns first

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
  
  const NumberCell = (cellProps) => {
    try{
      if(cellProps.rowType==='data'){

    if(cellProps.field==="shares")
    {
      return (
       
        <td aria-colindex={cellProps.columnIndex} style={{ textAlign: 'right' }}  role={"gridcell"}>
          { formatNumber(cellProps.dataItem[cellProps.field], "##,#.000000")}
        </td>
    );
    }
    else if(cellProps.field==="market")
    {
      return (
        
        <td aria-colindex={cellProps.columnIndex} style={{ textAlign: 'right' }}  role={"gridcell"}>
          { formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
        </td>          
    );
    }
    else if (cellProps.field === "income") {

      return (
        <td aria-colindex={cellProps.columnIndex} style={{ textAlign: 'right' }}  role={"gridcell"}>
          { formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
        </td>
      );
    }
    else if(cellProps.field==="marketPercent")
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
    else if (cellProps.field === "yield") {

      return (
        <td aria-colindex={cellProps.columnIndex} style={{ textAlign: 'right' }} role={"gridcell"}>
          { formatNumber(cellProps.dataItem[cellProps.field], "##,#.00")}
        </td>
      );
    }
  
  else if(cellProps.field==="mtrtyYr" )
  {
    return (
      <td aria-colindex={cellProps.columnIndex} role={"gridcell"}>
        Bonds Maturing In&nbsp;{ formatNumber(cellProps.dataItem[cellProps.field], "###")}
      </td>
  );
  } 
  else
  {
    return (
      <td aria-colindex={cellProps.columnIndex} role={"gridcell"}>
        {cellProps.dataItem[cellProps.field]}
      </td>
  );
      
  }}}
  catch{}
}

  const ShowCallPutDetails=(e)=>{
    setChkBoxState(e.target.checked);
  };
  
  const pageChange = (event) => {
    setPage(event.page);
  };

  const onExpandChange = (event) => {
    const isExpanded =
      event.dataItem.expanded === undefined
        ? event.dataItem.aggregates
        : event.dataItem.expanded;
    event.dataItem.expanded = !isExpanded;
    setResultState({ ...resultState });
  };  

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
   
    setResultState(processWithGroups(data,dataState));
    setDataState(dataState);
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
        <div className="card-header row d-flex justify-content-between align-items-center my-2">
        <div className="col">
          <p className="tableheader h6">Fixed Income Maturity Ladder Report</p>
        </div>
        <div className="col"></div>
        <div className="col">
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={excelExport}
          >
            Export to Excel
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="mx-1 px-1 my-1 py-1">
        
        <ExcelExport data={data} ref={_export}> 
       <Grid style={{ height: "450px" }}
            data={resultState}
            onRowClick={onRowClick}
            groupable={true}
           
            sortable={true}
            skip={page.skip}
            pageable={{
              pageSizes: true,
            }}
            pageSize={page.take}
            total={data.length}          
           
           // total={total}
           // filterable={true}
           resizable={true}
           onDataStateChange={onDataStateChange}
           {...dataState}
           onExpandChange={onExpandChange}
           expandField="expanded">
            <GridToolbar>
          <FormGroup>
      <FormControlLabel control={<Checkbox name='chkShwMtrtyCall' onChange={ShowCallPutDetails}/>} label="Show Call Details" />
    </FormGroup>
        </GridToolbar>
        {stateColumns.map(
                (column, idx) =>
                  column.show && (
                    <Column
                      width={setWidth(column.minWidth)}
                      locked={column.locked}
                      key={idx}
                      field={column.field}
                      title={column.title}
                      filter={column.filter}                      
                      cell={NumberCell}
                      headerCell={column.headerCell}
                      columnMenu={(props) => (
                        <CustomColumnMenu
                          {...props}
                          columns={stateColumns}
                          onColumnsSubmit={onColumnsSubmit}
                        />
                      )}
                    />
                  )
              )}
          </Grid>
          </ExcelExport>   
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
          

          </div>
          </div>
    </div>
  )
}

export default FixdIncmMaturityLadrGrd