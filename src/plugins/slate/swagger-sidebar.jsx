import React from "react"
import PropTypes from "prop-types"
import { Menu } from 'semantic-ui-react'

export default class SwaggerSidebar extends React.Component {

  static propTypes = {
    specActions: PropTypes.object.isRequired,
    specSelectors: PropTypes.object.isRequired,
    oas3Selectors: PropTypes.object.isRequired,
    oas3Actions: PropTypes.object.isRequired,
    layoutSelectors: PropTypes.object.isRequired,
    layoutActions: PropTypes.object.isRequired,
    authActions: PropTypes.object.isRequired,
    authSelectors: PropTypes.object.isRequired
  };

  render() {
    let {
      specSelectors,
      specActions,
      oas3Selectors,
      oas3Actions,
      layoutSelectors,
      layoutActions,
      authActions,
      authSelectors
    } = this.props

    return (
      <div>
        <Menu inverted vertical fixed='left'>
          <Menu.Item
            name='menu1'
          >
            Menu 1
          </Menu.Item>
          <Menu.Item
            name='menu2'
          >
            Menu 2
          </Menu.Item>
        </Menu>
      </div>
    )
  }
}
