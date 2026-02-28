// Header.js
import React from 'react'

import GrailsLaunchLogo from '../../images/grails-forge.svg?react'

const Header = () => {

    return (
        <div className="grails-header">
            <div className="logo-wrapper">
                <div className="container">
                    <a href="https://grails.apache.org">
                        <GrailsLaunchLogo />
                    </a>
                </div>
            </div>

        </div>
    )
}

export default Header
