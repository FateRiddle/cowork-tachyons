import React from 'react'
import { connect } from 'react-redux'
import Pop from 'components/Pop/Basic'
import Tabs from './Tabs'
import Info from './Info'
import Password from './Password'
import { changeUserSettingsTab, toggleUserSettings } from 'actions'

const tabs = [
  { value: 'info', name: '个人信息' },
  { value: 'password', name: '密码修改' }
]

class Settings extends React.Component {
  render() {
    const { hidden, tab, close, toggle } = this.props
    return (
      <Pop hidden={hidden} close={close}>
        <div className="w-100 flex flex-wrap content-start items-start">
          <div
            className="absolute top-0 right-0 pa3 f4 dim pointer"
            onClick={close}
            data-component="close button"
          >
            x
          </div>
          <header className="w-100 tc pb3 f3 b tracked">用户信息</header>
          <Tabs
            className="flex w-100 bb b--black-20 justify-center items-end"
            tab={tab}
            tabs={tabs}
            toggle={toggle}
          />
          {tab === 'info' ? <Info close={close} /> : <Password close={close} />}
        </div>
      </Pop>
    )
  }
}

const mapStateToProps = ({ visual }) => ({
  hidden: visual.userSettingsHidden,
  tab: visual.userSettingsTab
})

const ConnectedSettings = connect(mapStateToProps, {
  toggle: changeUserSettingsTab,
  close: toggleUserSettings
})(Settings)

export default ConnectedSettings
