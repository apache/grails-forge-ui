// StarterForm.js
import React from "react";
import { Grid } from '@material-ui/core'

import StarterFormApplicationType from './StarterFormApplicationType'
import StarterFormGorm from "./StarterFormGorm";
import StarterFormJavaVersion from './StarterFormJavaVersion'
import StarterFormMicronautVersion from './StarterFormMicronautVersion'
import StarterFormName from './StarterFormName'
import StarterFormPackage from './StarterFormPackage'
import StarterFormReloadingFramework from './StarterFormReloadingFramework'
import StarterFormServlet from './StarterFormServlet'

const StarterForm = ({ onError }) => {
  return (
    <Grid container spacing={1} className="mn-starter-form-main" alignItems="flex-end">
      <Grid item xs={12} sm={6} md={3}>
        <StarterFormApplicationType />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StarterFormJavaVersion />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StarterFormName />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StarterFormPackage />
      </Grid>
      <Grid item sm={3} xs={12} className="mn-radio">
        <StarterFormMicronautVersion />
      </Grid>
      <Grid item sm={3} xs={12} className="mn-radio">
        <StarterFormGorm />
      </Grid>
      <Grid item sm={3} xs={12} className="mn-radio">
        <StarterFormServlet />
      </Grid>
      <Grid item sm={3} xs={12} className="mn-radio">
        <StarterFormReloadingFramework />
      </Grid>
    </Grid>
  )
}

export default StarterForm
