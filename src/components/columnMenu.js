import * as React from 'react';
import {
  GridColumnMenuSort,
  GridColumnMenuFilter,
  GridColumnMenuGroup,
  GridColumnMenuItemGroup,
  GridColumnMenuItem,
  GridColumnMenuItemContent,

} from "@progress/kendo-react-grid";
export const ColumnMenu = props => {
  return <div>
        <GridColumnMenuSort {...props} />
        <GridColumnMenuFilter {...props} />
        <GridColumnMenuGroup {...props} />
        <GridColumnMenuItem {...props} />
        <GridColumnMenuItemContent {...props} />
      
      </div>;
};