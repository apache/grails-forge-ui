// StarterForm.js
import React from "react";
import Col from 'react-materialize/lib/Col'
import Row from 'react-materialize/lib/Row'

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
    <Row className="mn-starter-form-main">
      <Col s={8} m={6} l={3}>
        <StarterFormApplicationType />
      </Col>
      <Col s={4} m={6} l={3}>
        <StarterFormJavaVersion />
      </Col>
      <Col s={8} m={6} l={3}>
        <StarterFormName />
      </Col>
      <Col s={4} m={6} l={3}>
        <StarterFormPackage />
      </Col>
      <Col m={3} s={12} className="mn-radio">
        <StarterFormMicronautVersion />
      </Col>
      <Col m={3} s={12} className="mn-radio">
        <StarterFormGorm />
      </Col>
      <Col m={3} s={12} className="mn-radio">
        <StarterFormServlet />
      </Col>
      <Col m={3} s={12} className="mn-radio">
        <StarterFormReloadingFramework />
      </Col>
    </Row>
  )
}

export default StarterForm
