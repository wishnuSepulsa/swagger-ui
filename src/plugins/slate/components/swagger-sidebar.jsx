import React from "react"
import PropTypes from "prop-types"
import { Accordion, Menu } from "semantic-ui-react"
import * as slateUtils from "../utils.js"

export default class SwaggerSidebar extends React.Component {
  state = { activeIndex: 0 }
  parsedHeader = 0
  parsedDescriptionHeader = null

  static propTypes = {
    specActions: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired
  };

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  render() {
    let {
      specSelectors,
      specActions
    } = this.props

    let taggedOps = specSelectors.taggedOperations()
    let info = specSelectors.info()
    let info_description = info.get("description")
    const { activeIndex } = this.state
    const { parsedHeader } = this.parsedHeader

    if (this.parsedHeader === 0 && info_description != undefined) {
      this.parsedHeader = 1
      this.parsedDescriptionHeader = slateUtils.parseDescriptionHeader(info_description)
    }

    let i = 0
    return (
        <Accordion as={Menu} inverted vertical fixed='left'>
          {
            this.parsedHeader === 1 ?
              this.parsedDescriptionHeader.map( (headerDesc, index) => {
                i++
                return (
                  <Menu.Item
                    key={headerDesc.id}
                   >
                    <Accordion.Title
                      active={activeIndex === i}
                      content={ headerDesc.name }
                      index={i}
                      onClick={this.handleClick}
                    />
                    <Accordion.Content active={activeIndex === i}>
                      {
                        headerDesc.operationsArray.map( op => {
                          const summary = op.summary
                          return(
                            <Menu.Item
                            key={op.id}
                            >
                            { op.summary }
                            </Menu.Item>
                          )
                        })
                      }
                    </Accordion.Content>
                  </Menu.Item>
                )
              }) : null
          }
          {
            taggedOps.map( (tagObj, tag) => {
              i++
              let operations = tagObj.get("operations")
              return(
                <Menu.Item
                  key={tag}
                  >
                  <Accordion.Title
                    active={activeIndex === i}
                    content={tag}
                    index={i}
                    onClick={this.handleClick}
                  />
                  <Accordion.Content active={activeIndex === i}>
                    {
                      operations.map( op => {
                        const summary = op.getIn(["operation", "summary"])
                        const key = op.get("id")
                        return(
                          <Menu.Item
                            key={key}
                          >
                          { summary }
                          </Menu.Item>
                        )
                      }).toArray()
                    }
                  </Accordion.Content>
                </Menu.Item>
              )
            }).toArray()
          }
        </Accordion>
    )
  }
}
