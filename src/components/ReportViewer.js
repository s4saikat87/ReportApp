import ReactDOM from 'react-dom'
import React from 'react'

import { TelerikReportViewer } from '@progress/telerik-react-report-viewer'

const ReportViewer = () => {
    let viewer;
    ReactDOM.render(
        <div>
            <TelerikReportViewer
                ref={el => viewer = el}
                

                serviceUrl="https://localhost:44391/api/reports/"
                reportSource={{
                    report: 'Report1111.trdp',
                    parameters: {
                     // "acctId":"12551"
                    }
                }}
                viewerContainerStyle={{
                    position: 'absolute',
                    left: '5px',
                    right: '5px',
                    top: '40px',
                    bottom: '5px',
                    overflow: 'hidden',
                    clear: 'both',
                    fontFamily: 'ms sans serif'
                }}
                viewMode="INTERACTIVE"
                scaleMode="SPECIFIC"
                scale={1.0}
                enableAccessibility={false} />
            <button id="refresh-button" onClick={() => viewer.refreshReport()}>Refresh</button>
            <button onClick={() => viewer.commands.print.exec()}>Print</button>
        </div>,

        document.getElementById('root')
    );
}

export default ReportViewer


