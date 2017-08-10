import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Dropdown } from 'semantic-ui-react'
import { logout, toggleUserSettings } from 'actions'
import Settings from './Settings'

class UserSettings extends React.Component {
  popSetting = () => {
    this.props.toggleUserSettings()
  }

  onLogout = () => {
    const { logout, history } = this.props
    logout()
    history.push('/home/login')
  }

  render() {
    const { me } = this.props
    return (
      <div data-component="User-wrapper" className="w5 flex justify-end pr3 black-60">
        <Dropdown
          data-component="User"
          className="tracked pv3 pl4 pl5-ns pr3"
          text={me.name}
          inline
          icon={null}
        >
          <Dropdown.Menu className="w-100">
            <Dropdown.Item icon="setting" text="设置" onClick={this.popSetting} />
            <Dropdown.Item icon="log out" text="登出" onClick={this.onLogout} />
          </Dropdown.Menu>
        </Dropdown>
        <Settings />
      </div>
    )
  }
}

const mapStateToProps = ({ me }) => ({ me })

const ConnectedUserSettings = withRouter(
  connect(mapStateToProps, { logout, toggleUserSettings })(UserSettings)
)

export default ConnectedUserSettings
