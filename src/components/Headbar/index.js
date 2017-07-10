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
      <div className="Headbar">
        <div
          className={classnames('Headbar__openSidebar', {
            'Sidebar--hidden': !sidebarHidden
          })}
          onClick={toggleSidebar}
        >
          三
        </div>
        <NavLink
          to={`/${me.id}`}
          onClick={() => this.onMyTaskClick(me.id)}
          className="Headbar__myTask"
          activeClassName="Headbar__myTask--active"
        >
          My Tasks:
        </NavLink>
        <Searchform />
        <div onClick={this.test}>test</div>
        <div className="Headbar__user">
          <button className="ui small green button">
            Download
          </button>
          <div className="Headbar__me">{me.name}</div>
          <div className="Headbar__logout" onClick={this.onLogout}>登出</div>
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
