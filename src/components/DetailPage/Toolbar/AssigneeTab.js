import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { editTaskAssignee } from '../../../actions'
import { getAllUsers } from '../../../reducers'
import Drop from '../../parts/Drop'

class AssigneeTab extends React.Component {
  render(){
    const { assignee,allUsers,currentTask } = this.props
    const users = [...allUsers,{name:'nobody',id:''}] //add this to match when task is assigned to nobody
    return (
      <Drop
        titleId={assignee || ''}
        dropArray={users}
        changeTitle={userId => this.props.editTaskAssignee(userId,currentTask)}
      />
    )
  }
}

const mapStateToProps = (state,{ match }) => {
  const allUsers = getAllUsers(state)
  const currentTask = match.params.taskId
  const { assignee } = state.tasks.byId[currentTask] || '' //in case it is undefined
  return {
    allUsers,
    currentTask,
    assignee,
  }
}

AssigneeTab = withRouter(
  connect(mapStateToProps,
    { editTaskAssignee }
  )(AssigneeTab)
)

export default AssigneeTab
