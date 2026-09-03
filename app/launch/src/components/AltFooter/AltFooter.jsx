const AltFooter = () => (
    <footer>
        <div className="content">
            <div className="apache-grails">
                <p>Apache Grails is supported by the Apache Software Foundation and the Grails community.</p>
                <a href='https://apache.org'><img className='' src='https://www.apache.org/img/asf_logo.png'
                                                  width='300px'
                                                  alt='Apache Software Foundation'/></a>
                <p>The Apache Software Foundation</p>
                <p>Apache, Apache Grails, Grails, Groovy, and the ASF logo are either registered trademarks or
                    trademarks
                    of The Apache Software Foundation.
                </p>
            </div>
            <nav className="socialmedianav">
                <ul>
                    <li><a href="mailto:dev@grails.apache.org"><img src="https://grails.apache.org/images/email.svg"
                                                                    alt="Email Icon"/></a></li>
                    <li><a href="https://slack.grails.org"><img src="https://grails.apache.org/images/slack.svg"
                                                                alt="Slack Icon"/></a></li>
                    <li><a href="https://www.youtube.com/@GrailsFramework"><img
                        src="https://grails.apache.org/images/youtube.svg"
                        alt="Youtube Icon"/></a></li>
                    <li><a href="https://www.linkedin.com/showcase/official-grails/"><img
                        src="https://grails.apache.org/images/linkedin.svg" alt="LinkedIn Icon"/></a></li>
                    <li><a href="https://github.com/apache/grails-core"><img
                        src="https://grails.apache.org/images/github.svg"
                        alt="Github Icon"/></a></li>
                    <li><a href="https://x.com/grailsframework">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" width="45px" height="45px"
                             viewBox="-100 -100 500 500">
                            <circle cx="150" cy="150" r="250" fill="#8C8C8C"/>
                            <path
                                d="M178.57 127.15 290.27 0h-26.46l-97.03 110.38L89.34 0H0l117.13 166.93L0 300.25h26.46l102.4-116.59 81.8 116.59h89.34M36.01 19.54H76.66l187.13 262.13h-40.66"
                                fill="white"/>
                        </svg>
                    </a></li>
                </ul>
            </nav>
        </div>
        <div className="content">
            <nav className="partnersnav">
                <p>© 2005-2026 The Apache Software Foundation — Grails is Open Source:&nbsp;
                    <a href='https://www.apache.org/licenses/'>License</a>,&nbsp;
                    <a href='https://privacy.apache.org/policies/privacy-policy-public.html'>Privacy Policy</a>,&nbsp;
                    <a href='https://www.apache.org/foundation/sponsorship'>Sponsor Apache</a>,&nbsp;
                    <a href='https://www.apache.org/events/current-event'>Events</a>,&nbsp;
                    <a href='https://www.apache.org/security'>Security</a>,&nbsp;
                    <a href='https://www.apache.org/foundation/thanks.html'>Thanks</a>
                </p>
            </nav>
        </div>
    </footer>
)

export default AltFooter
