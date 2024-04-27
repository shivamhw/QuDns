import * as React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

export type alertProp = {
    severity : "success" | "info" | "warning" | "error",
    title: string,
    msg : string
}
export default function DescriptionAlerts({alert} : {alert: alertProp}) {
    console.log("in alert got ", alert)
  return (
      <Alert severity={alert.severity}>
        <AlertTitle>{alert.title}</AlertTitle>
        {alert.msg}
      </Alert>
    //   <Alert severity="info">
    //     <AlertTitle>Info</AlertTitle>
    //     This is an info Alert with an informative title.
    //   </Alert>
    //   <Alert severity="warning">
    //     <AlertTitle>Warning</AlertTitle>
    //     This is a warning Alert with a cautious title.
    //   </Alert>
    //   <Alert severity="error">
    //     <AlertTitle>Error</AlertTitle>
    //     This is an error Alert with a scary title.
    //   </Alert>
  );
}