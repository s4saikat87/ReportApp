import React from 'react'
import { Grid, GridColumn as Column, GridToolbar } from "@progress/kendo-react-grid";
import { formatNumber, formatDate  } from '@telerik/kendo-intl';
const GrdAsset = ({ data }) => {
  
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
       <div className="col col-md-12 col-sm-12 py-2">
       <div className="card-header tableheader">Asset Data</div>
                    <div className="rounded">
                        
                        <div className="w-100">
                        <Grid style={{ height: "500px" }}
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

                <Column field="symbol" menu={true} title="Symbol" width="300px" />

                <Column field="astShrtNm" title="Short Name" width="370px" 

                // footerCell={TotalPaymentCell}
                />
                 <Column field="mv" title="Market Value($)" cell={NumberCell} headerCell={RightNameHeader} width="210px" format="{0:n2}" filter="numeric" filterable={false} />
                <Column field="mvPercent" menu={true} title="Market Value(%)" cell={NumberCell} headerCell={RightNameHeader} format="{0:n2}" width="170px" />



            </Grid>
                        </div>

                    </div>
                </div>
    </div>
    </div>
  )
}

export default GrdAsset
