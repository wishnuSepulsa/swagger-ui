import React from "react"
import PropTypes from "prop-types"
import { helpers } from "swagger-client"
import { createDeepLinkPath, sanitizeUrl } from "core/utils"
const { opId } = helpers
import { Header } from "semantic-ui-react"

export default class Operations extends React.Component {

  static propTypes = {
    specSelectors: PropTypes.object.isRequired,
    specActions: PropTypes.object.isRequired,
    oas3Actions: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    layoutSelectors: PropTypes.object.isRequired,
    layoutActions: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired,
    authSelectors: PropTypes.object.isRequired,
    getConfigs: PropTypes.func.isRequired
  };

  render() {
    let {
      specSelectors,
      specActions,
      oas3Actions,
      getComponent,
      layoutSelectors,
      layoutActions,
      authActions,
      authSelectors,
      getConfigs,
      fn
    } = this.props

    let taggedOps = specSelectors.taggedOperations()

    const Operation = getComponent("operation")
    const Collapse = getComponent("Collapse")
    const Markdown = getComponent("Markdown")

    let showSummary = layoutSelectors.showSummary()
    let {
      docExpansion,
      displayOperationId,
      displayRequestDuration,
      maxDisplayedTags,
      deepLinking
    } = getConfigs()

    const isDeepLinkingEnabled = deepLinking && deepLinking !== "false"

    let filter = layoutSelectors.currentFilter()

    if (filter) {
      if (filter !== true) {
        taggedOps = taggedOps.filter((tagObj, tag) => {
          return tag.indexOf(filter) !== -1
        })
      }
    }

    if (maxDisplayedTags && !isNaN(maxDisplayedTags) && maxDisplayedTags >= 0) {
      taggedOps = taggedOps.slice(0, maxDisplayedTags)
    }

    return (
        <div>
          {
            taggedOps.map( (tagObj, tag) => {
              let operations = tagObj.get("operations")
              let tagDescription = tagObj.getIn(["tagDetails", "description"], null)
              let tagExternalDocsDescription = tagObj.getIn(["tagDetails", "externalDocs", "description"])
              let tagExternalDocsUrl = tagObj.getIn(["tagDetails", "externalDocs", "url"])

              let isShownKey = ["operations-tag", createDeepLinkPath(tag)]
              let showTag = layoutSelectors.isShown(isShownKey, docExpansion === "full" || docExpansion === "list")

              return (
                <div key={"operation-" + tag} className='slate-operations'>
                  <h1 className="slate-header-tag">{tag}</h1>
                  {
                      operations.map( op => {

                        const path = op.get("path", "")
                        const method = op.get("method", "")
                        const jumpToKey = `paths.${path}.${method}`

                        const operationId =
                        op.getIn(["operation", "operationId"]) || op.getIn(["operation", "__originalOperationId"]) || opId(op.get("operation"), path, method) || op.get("id")
                        const isShownKey = ["operations", createDeepLinkPath(tag), createDeepLinkPath(operationId)]

                        const allowTryItOut = specSelectors.allowTryItOutFor(op.get("path"), op.get("method"))
                        const response = specSelectors.responseFor(op.get("path"), op.get("method"))
                        const request = specSelectors.requestFor(op.get("path"), op.get("method"))

                        return <Operation
                          {...op.toObject()}

                          isShownKey={isShownKey}
                          jumpToKey={jumpToKey}
                          showSummary={showSummary}
                          key={isShownKey}
                          response={ response }
                          request={ request }
                          allowTryItOut={allowTryItOut}

                          displayOperationId={displayOperationId}
                          displayRequestDuration={displayRequestDuration}

                          specActions={ specActions }
                          specSelectors={ specSelectors }

                          oas3Actions={oas3Actions}

                          layoutActions={ layoutActions }
                          layoutSelectors={ layoutSelectors }

                          authActions={ authActions }
                          authSelectors={ authSelectors }

                          getComponent={ getComponent }
                          fn={fn}
                          getConfigs={ getConfigs }
                        />
                      }).toArray()
                    }
                </div>
                )
            }).toArray()
          }

          { taggedOps.size < 1 ? <h3> No operations defined in spec! </h3> : null }
        </div>
    )
  }

}

Operations.propTypes = {
  layoutActions: PropTypes.object.isRequired,
  specSelectors: PropTypes.object.isRequired,
  specActions: PropTypes.object.isRequired,
  layoutSelectors: PropTypes.object.isRequired,
  getComponent: PropTypes.func.isRequired,
  fn: PropTypes.object.isRequired
}
