import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { editTaskAssignee } from 'actions'
import { getUserByTask, getTaskById, getUserById } from 'reducers'
import { Dropdown } from 'semantic-ui-react'

class AssigneeTab extends React.Component {
  getUserOptions = () => {
    const { users, currentAssigned, me } = this.props
    let userArray = []
    if (users.length > 0) {
      if (me && users.findIndex(u => u.id === me.id) === -1) {
        userArray = [me, ...users, { id: '0', name: '无人' }]
      } else {
        userArray = [...users, { id: '0', name: '无人' }] //add this to match when task is assigned to nobody
      }
    } else {
      if (currentAssigned && currentAssigned.id !== me.id) {
        userArray = [currentAssigned, me, { id: '0', name: '无人' }] //if task is created without a project, it can still assign to me.
      } else {
        userArray = [me, { id: '0', name: '无人' }]
      }
    }
    return userArray.map(user => ({
      key: user.id,
      value: user.id,
      text: user.name
    }))
  }

  onChange = (e, data) => {
    const { editTaskAssignee, currentTask } = this.props
    editTaskAssignee(data.value, currentTask)
  }

  render() {
    const { assignee, disabled } = this.props
    return (
      <Dropdown
        className="pl1 pl3-ns pv2 w3 w4-ns black-50 hover-thin-blue"
        value={assignee}
        options={this.getUserOptions()}
        onChange={this.onChange}
        disabled={disabled} //使用了不同的canEdit判断，所有组员都可以修改 2017/9/20 毛豆组要求
      />
    )
  }
}

const mapStateToProps = (state, { match }) => {
  const currentTask = match.params.taskId
  const task = getTaskById(state, currentTask) || {} //in case it is undefined
  const { assignee, rootTaskId } = task
  let users = []
  if (rootTaskId) {
    users = getUserByTask(state, rootTaskId)
  } else {
    users = getUserByTask(state, currentTask)
  }
  const _assignee = assignee ? assignee : '0' //Dropdown插件的value不接受''，所以必须赋值'0'
  const canEdit =
    task && task.completed === 'active' && match.params.id !== 'search'
  return {
    users,
    currentAssigned: getUserById(state, _assignee),
    me: state.me,
    currentTask,
    assignee: _assignee,
    disabled: !canEdit
  }
}

const ConnectedAssigneeTab = withRouter(
  connect(mapStateToProps, { editTaskAssignee })(AssigneeTab)
)

export default ConnectedAssigneeTab
