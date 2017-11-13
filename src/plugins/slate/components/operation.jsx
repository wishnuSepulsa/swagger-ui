import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { getList } from "core/utils"
import * as CustomPropTypes from "core/proptypes"
import { sanitizeUrl } from "core/utils"

//import "less/opblock"

export default class Operation extends PureComponent {
  constructor(props, context) {
    super(props, context)
    this.state = {
      tryItOutEnabled: false
    }
  }

  static propTypes = {
    path: PropTypes.string.isRequired,
    method: PropTypes.string.isRequired,
    operation: PropTypes.object.isRequired,
    showSummary: PropTypes.bool,

    isShownKey: CustomPropTypes.arrayOrString.isRequired,
    jumpToKey: CustomPropTypes.arrayOrString.isRequired,

    allowTryItOut: PropTypes.bool,

    displayOperationId: PropTypes.bool,
    displayRequestDuration: PropTypes.bool,

    response: PropTypes.object,
    request: PropTypes.object,

    getComponent: PropTypes.func.isRequired,
    authActions: PropTypes.object,
    authSelectors: PropTypes.object,
    specActions: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,
    oas3Actions: PropTypes.object.isRequired,
    layoutActions: PropTypes.object.isRequired,
    layoutSelectors: PropTypes.object.isRequired,
    fn: PropTypes.object.isRequired,
    getConfigs: PropTypes.func.isRequired
  }

  static defaultProps = {
    showSummary: true,
    response: null,
    allowTryItOut: true,
    displayOperationId: false,
    displayRequestDuration: false
  }

  componentWillReceiveProps(nextProps) {
    const defaultContentType = "application/json"
    let { specActions, path, method, operation } = nextProps
    let producesValue = operation.get("produces_value")
    let produces = operation.get("produces")
    let consumes = operation.get("consumes")
    let consumesValue = operation.get("consumes_value")

    if(nextProps.response !== this.props.response) {
      this.setState({ executeInProgress: false })
    }

    if (producesValue === undefined) {
      producesValue = produces && produces.size ? produces.first() : defaultContentType
      specActions.changeProducesValue([path, method], producesValue)
    }

    if (consumesValue === undefined) {
      consumesValue = consumes && consumes.size ? consumes.first() : defaultContentType
      specActions.changeConsumesValue([path, method], consumesValue)
    }
  }

  toggleShown =() => {
    let { layoutActions, isShownKey } = this.props
    layoutActions.show(isShownKey, !this.isShown())
  }

  isShown =() => {
    let { layoutSelectors, isShownKey, getConfigs } = this.props
    let { docExpansion } = getConfigs()

    return layoutSelectors.isShown(isShownKey, docExpansion === "full" ) // Here is where we set the default
  }

  onTryoutClick =() => {
    this.setState({tryItOutEnabled: !this.state.tryItOutEnabled})
  }

  onCancelClick =() => {
    let { specActions, path, method } = this.props
    this.setState({tryItOutEnabled: !this.state.tryItOutEnabled})
    specActions.clearValidateParams([path, method])
  }

  onExecute = () => {
    this.setState({ executeInProgress: true })
  }

  render() {
    let {
      isShownKey,
      jumpToKey,
      path,
      method,
      operation,
      showSummary,
      response,
      request,
      allowTryItOut,
      displayOperationId,
      displayRequestDuration,
      fn,
      getComponent,
      specActions,
      specSelectors,
      authActions,
      authSelectors,
      getConfigs,
      oas3Actions
    } = this.props

    let summary = operation.get("summary")
    let description = operation.get("description")
    let deprecated = operation.get("deprecated")
    let externalDocs = operation.get("externalDocs")
    let responses = operation.get("responses")
    let security = operation.get("security") || specSelectors.security()
    let produces = operation.get("produces")
    let schemes = operation.get("schemes")
    let parameters = getList(operation, ["parameters"])
    let operationId = operation.get("__originalOperationId")
    let operationScheme = specSelectors.operationScheme(path, method)

    const Responses = getComponent("responses")
    const Parameters = getComponent( "parameters" )
    const Execute = getComponent( "execute" )
    const Clear = getComponent( "clear" )
    const AuthorizeOperationBtn = getComponent( "authorizeOperationBtn" )
    const JumpToPath = getComponent("JumpToPath", true)
    const Collapse = getComponent( "Collapse" )
    const Markdown = getComponent( "Markdown" )
    const Schemes = getComponent( "schemes" )

    let SchemaSamples = getComponent("SchemaSamples", true)

    const { deepLinking } = getConfigs()

    const isDeepLinkingEnabled = deepLinking && deepLinking !== "false"

    // Merge in Live Response
    if(responses && response && response.size > 0) {
      let notDocumented = !responses.get(String(response.get("status")))
      response = response.set("notDocumented", notDocumented)
    }

    let { tryItOutEnabled } = this.state
    let shown = this.isShown()
    let onChangeKey = [ path, method ] // Used to add values to _this_ operation ( indexed by path and method )

    return (
      <div className='slate-operations-wrapper'>
        <div id={isShownKey.join("-")} className='slate-operation'>
          <div className='slate-operation-content'>
            <div className={'slate-heading ' + method}>
                <h2 className='slate-operation-title'>{summary}</h2>
                <h3>
                    <span className='slate-http_method'>
                        <a 
                        href={`#/${isShownKey[1]}/${isShownKey[2]}`}>{method.toUpperCase()}</a>
                    </span>
                    <span className='slate-path'>
                        <a href={`#/${isShownKey[1]}/${isShownKey[2]}`}
                           >{path}</a>
                    </span>
                </h3>
            </div>
            { description &&
                  <div className="opblock-description-wrapper">
                    <div className="opblock-description">
                      <Markdown source={ description } />
                    </div>
                  </div>
                }
          </div>
          <div className='slate-operation-samples'>
            <SchemaSamples/>
          </div>
        </div>
      </div>
    )
  }

}
