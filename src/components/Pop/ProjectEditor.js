import React from 'react'
import PropTypes from 'prop-types'
import Pop from '../Pop'
import { connect } from 'react-redux'
import * as actions from 'actions'
import { getAllUsers } from 'reducers'
import isEmpty from 'lodash/isEmpty'

class ProjectEditor extends React.Component {
  state = { alertText: '', userListHidden: true, group: [] }

  componentWillReceiveProps(nextProps) {
    if (this.props.hidden && !nextProps.hidden) {
      this.setState({ group: nextProps.project.group || [] })
    }
  }

  addUser = id => {
    this.setState({
      group: [...this.state.group, id],
    })
  }

  removeUser = id => {
    this.setState({
      group: this.state.group.filter(userId => userId !== id),
    })
  }

  handleOKClick = () => {
    const { project, closeWindow, editProject, addProject } = this.props //必须要
    const title = this.titleDOM.value
    if (title === '') {
      this.setState({ alertText: '请填写项目名' })
      return
    }
    if (this.state.group.length === 0) {
      this.setState({ alertText: '項目組至少要有一人' })
      return
    }
    this.setState({ alertText: '', userListHidden: true })

    if (isEmpty(project)) {
      //说明是添加的新项目
      addProject(title, this.state.group).then(res => {
        if (res.value.output.message === '此项目名已存在。') {
          this.setState({ alertText: '此项目名已存在。' })
        } else {
          closeWindow()
        }
      })
      return
    }

    editProject(this.titleDOM.value, this.state.group, project.id).then(res => {
      if (res.value.output.message === '此项目名已存在。') {
        this.setState({ alertText: '此项目名已存在。' })
      } else {
        closeWindow()
      }
    })
  }

  handleCancelClick = () => {
    this.setState({ alertText: '', userListHidden: true })
    this.props.closeWindow()
  }

  toggleUserList = () => {
    this.setState({ userListHidden: !this.state.userListHidden })
  }

  children = () => {
    const { userListHidden, group, alertText } = this.state
    const { allUsers, project } = this.props
    const groupUsers = allUsers.filter(u => group.indexOf(u.id) > -1)
    const restOfUsers = allUsers.filter(u => group.indexOf(u.id) === -1)
    return (
      <div data-component="editor-content">
        <h2 className="a">项目</h2>
        <input
          className="ph3 ba pv2 br2 w-90 b--black-30 outline-0 black-80 mb3"
          placeholder="项目名称"
          defaultValue={project.title}
          ref={node => (this.titleDOM = node)}
        />
        <div className="h2 red" data-component="warning">
          {alertText}
        </div>
        <div className="flex flex-wrap mb2" data-component="users">
          <span className="ph3 pv2 black-50 border-box">用户列表</span>
          <span
            className="ph3 pv2 ba br2 b--black-30 pointer black-50 f4 dim"
            onClick={this.toggleUserList}
          >
            {userListHidden ? '+' : '-'}
          </span>
        </div>
        {!userListHidden &&
          <ul className="w-100 ph3 pv2 flex flex-wrap" data-component="userList">
            {!userListHidden &&
              restOfUsers.map(user =>
                <li key={user.id} className="pv1 ph2 ma1 ba br2 b--black-30 pointer">
                  <span onClick={() => this.addUser(user.id)}>
                    {user.name}
                  </span>
                </li>
              )}
          </ul>}

        <div className="ph3 pv2 black-50 border-box">项目组员</div>
        <ul
          className="w-100 ph3 pv2 flex flex-wrap items-start min-h-text"
          data-component="userList"
        >
          {groupUsers.map(user =>
            <li key={user.id} className="pv1 ph2 ma1 ba br2 b--cyan cyan bg-washed-cyan pointer">
              <span onClick={() => this.removeUser(user.id)}>
                {user.name}
              </span>
            </li>
          )}
        </ul>
      </div>
    )
  }

  render() {
    const { hidden } = this.props
    return (
      <Pop
        hidden={hidden}
        onOKClick={this.handleOKClick}
        onCancelClick={this.handleCancelClick}
        children={this.children()}
      />
    )
  }
}

ProjectEditor.PropTypes = {
  project: PropTypes.object.isRequired,
  hidden: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
}

const mapStateToProps = state => {
  // const group = project.group || [] //if project is empty when you wann create a new one
  const allUsers = getAllUsers(state)
  // const restOfUsers = allUsers.filter(user => group.indexOf(user.id) === -1)
  return {
    allUsers,
  }
}

ProjectEditor = connect(mapStateToProps, actions)(ProjectEditor)

export default ProjectEditor
