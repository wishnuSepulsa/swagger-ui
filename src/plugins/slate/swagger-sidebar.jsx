import React from "react"
import PropTypes from "prop-types"
import { Accordion, Menu } from 'semantic-ui-react'

export default class SwaggerSidebar extends React.Component {
  state = { activeIndex: 0 }

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
    const { activeIndex } = this.state
    console.log(info.get("description"));
    let i = 0
    return (
        <Accordion as={Menu} inverted vertical fixed='left'>
          {
            taggedOps.map( (tagObj, tag) => {
              i++
              //const index = tagObj._map.get(k)
              //console.log(tagObj, tag, index)
              let operations = tagObj.get("operations")
              return(
                <Menu.Item>
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
                        return(
                          <Menu.Item>
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
