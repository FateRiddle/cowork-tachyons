import React from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Dropdown } from 'semantic-ui-react'
import { getUserById,getTaskById,getUserByTask } from 'reducers'
import { editTaskAssignee } from 'actions'

class AssignTab extends React.Component {

  onChange = (e,data) => {
    const assignee = data.value
    const { editTaskAssignee,taskId } = this.props
    editTaskAssignee(assignee,taskId)
  }

  getOptions = () => {
    const { groupUsers } = this.props
    const group = groupUsers.map(user => ({key:user.id,value:user.id,text:user.name}))
    return [...group,{key:0,value:'0',text:'nobody'}]
  }

  render() {
    const { user={},task } = this.props
    const { id:projectId } = this.props.match.params
    console.log(task.assignee,user.id)
    return (
      projectId &&
      <Dropdown
        value={task.assignee?user.id:'0'}
        options={this.getOptions()}
        onChange={this.onChange}
      />
    )
  }
}

AssignTab.propTypes = {
  taskId: React.PropTypes.string.isRequired
}

const mapStateToProps = (state,{ taskId }) => {
  const task = getTaskById(state,taskId)
  return {
    task,
    user: getUserById(state,task.assignee),
    groupUsers: getUserByTask(state,taskId)
  }
}

AssignTab = withRouter(
  connect(mapStateToProps,
    {editTaskAssignee}
  )(AssignTab)
)

export default AssignTab
