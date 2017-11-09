import React from "react"
import PropTypes from "prop-types"

export default class BaseLayout extends React.Component {

  static propTypes = {
    errSelectors: PropTypes.object.isRequired,
    errActions: PropTypes.object.isRequired,
    specActions: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,
    oas3Selectors: PropTypes.object.isRequired,
    oas3Actions: PropTypes.object.isRequired,
    layoutSelectors: PropTypes.object.isRequired,
    layoutActions: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired
  }

  render() {
    let {
      specSelectors,
      specActions,
      getComponent,
      layoutSelectors,
      oas3Selectors,
      oas3Actions
    } = this.props

    let info = specSelectors.info()
    let url = specSelectors.url()
    let basePath = specSelectors.basePath()
    let host = specSelectors.host()
    let securityDefinitions = specSelectors.securityDefinitions()
    let externalDocs = specSelectors.externalDocs()
    let schemes = specSelectors.schemes()
    let servers = specSelectors.servers()

    let Info = getComponent("info")
    let Operations = getComponent("operations", true)
    let Models = getComponent("Models", true)
    let AuthorizeBtn = getComponent("authorizeBtn", true)
    let Row = getComponent("Row")
    let Col = getComponent("Col")
    let Servers = getComponent("Servers")
    let Errors = getComponent("errors", true)

    let SwaggerSidebar = getComponent("SwaggerSidebar", true)

    let isLoading = specSelectors.loadingStatus() === "loading"
    let isFailed = specSelectors.loadingStatus() === "failed"
    let filter = layoutSelectors.currentFilter()

    let inputStyle = {}
    if(isFailed) inputStyle.color = "red"
    if(isLoading) inputStyle.color = "#aaa"

    const Schemes = getComponent("schemes")

    const isSpecEmpty = !specSelectors.specStr()

    if(isSpecEmpty) {
      return <h4>No spec provided.</h4>
    }

    return (
      <div className='swagger-ui'>
        <SwaggerSidebar/>
        <div className='swagger-ui-content-wrapper'>
          <div className='swagger-ui-content-container'>
            <Errors/>
            <Row className="information-container">
              <Col mobile={12}>
                { info.count() ? (
                  <Info info={ info } url={ url } host={ host } basePath={ basePath } externalDocs={externalDocs} getComponent={getComponent}/>
                ) : null }
              </Col>
            </Row>
            { securityDefinitions ? (
              <div className="scheme-container">
                <Col className="schemes wrapper" mobile={12}>
                  { schemes && schemes.size ? (
                    <Schemes
                      currentScheme={specSelectors.operationScheme()}
                      schemes={ schemes }
                      specActions={ specActions } />
                  ) : null }

                  { securityDefinitions ? (
                    <AuthorizeBtn />
                  ) : null }
                </Col>
              </div>
            ) : null }

            { servers && servers.size ? (
              <div className="server-container">
                <Col className="servers wrapper" mobile={12}>
                  <Servers
                    servers={servers}
                    currentServer={oas3Selectors.selectedServer()}
                    setSelectedServer={oas3Actions.setSelectedServer}
                    setServerVariableValue={oas3Actions.setServerVariableValue}
                    getServerVariable={oas3Selectors.serverVariableValue}
                    getEffectiveServerValue={oas3Selectors.serverEffectiveValue}
                    />
                </Col>
              </div>

            ) : null}

            <Row>
              <Col mobile={12} desktop={12} >
                <Operations/>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    )
  }
}
