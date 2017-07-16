import React from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import classnames from 'classnames'
import Searchform from './Searchform'
import Warning from '../parts/Warning'
import * as actions from 'actions'
import { withRouter } from 'react-router'
import { getAllSubtasks, getTaskStack } from 'reducers'

class Headbar extends React.Component {
  onLogout = () => {
    this.props.logout()
    this.props.history.push('/home')
  }

  onMyTaskClick = id => {
    this.props.updateUserTasks(id)
    this.props.changeCurrentTask()
  }

  test = () => {
    const id = '42e483b3-8500-4d48-a9c7-b69db32212ab'
    console.log(this.props.stack(id))
  }

  render() {
    const { me, toggleSidebar, sidebarHidden } = this.props
    return (
      <div className="relative flex w-100 h3 justify-between border-box items-center shadow-1">
        <div
          className={classnames('self-start absolute pa2 left-0 black-60 dim', {
            dn: !sidebarHidden
          })}
          onClick={toggleSidebar}
        >
          三
        </div>
        <NavLink
          to={`/${me.id}`}
          onClick={() => this.onMyTaskClick(me.id)}
          className="black-60 pl4 hover-thin-blue"
        >
          我的任务
        </NavLink>
        <Searchform />
        {/* <div onClick={this.test}>test</div> */}
        <div className="flex" data-component="user">
          <div className="ph3 black-60">{me.name}</div>
          <div
            className="pr4 black-60 hover-thin-blue pointer"
            onClick={this.onLogout}
          >
            登出
          </div>
        </div>
        <Warning />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  sidebarHidden: state.sidebarHidden,
  me: state.me,
  getSubs: id => getAllSubtasks(state, id),
  stack: id => getTaskStack(state, id)
})

Headbar = withRouter(connect(mapStateToProps, { ...actions })(Headbar))

export default Headbar
