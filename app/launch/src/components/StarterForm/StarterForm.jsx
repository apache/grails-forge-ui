// StarterForm.js
import React from "react";
import Grid from '@mui/material/Grid'

import StarterFormApplicationType from './StarterFormApplicationType'
import StarterFormGorm from "./StarterFormGorm";
import StarterFormJavaVersion from './StarterFormJavaVersion'
import StarterFormMicronautVersion from './StarterFormMicronautVersion'
import StarterFormName from './StarterFormName'
import StarterFormPackage from './StarterFormPackage'
import StarterFormReloadingFramework from './StarterFormReloadingFramework'
import StarterFormServlet from './StarterFormServlet'

const StarterForm = ({ _onError }) => {
  return (
    <div className="mn-starter-form-main">
      <Grid container spacing={1} alignItems="flex-end">
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StarterFormApplicationType />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StarterFormJavaVersion />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StarterFormName />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StarterFormPackage />
        </Grid>
      </Grid>
      <Grid container spacing={1} alignItems="flex-start" className="mn-radio-row">
        <Grid size={{ xs: 12, sm: 3 }} className="mn-radio">
          <StarterFormMicronautVersion />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }} className="mn-radio">
          <StarterFormGorm />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }} className="mn-radio">
          <StarterFormServlet />
        </Grid>
        <Grid size={{ xs: 12, sm: 3 }} className="mn-radio">
          <StarterFormReloadingFramework />
        </Grid>
      </Grid>
    </div>
  )
}

export default StarterForm
