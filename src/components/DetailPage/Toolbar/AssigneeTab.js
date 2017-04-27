import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { editTaskAssignee } from '../../../actions'
import { getUserByTask,getTaskById,getUserById } from '../../../reducers'
import Drop from '../../parts/Drop'
import { me } from '../../../data'

class AssigneeTab extends React.Component {

  render(){
    const { assigneeName,users,currentTask } = this.props
    const userArray = [...users,me,{id:'',name:'nobody'}] //add this to match when task is assigned to nobody
    return (
      <Drop
        className="Drop__assignee"
        title={assigneeName || 'assign'}
        dropArray={userArray}
        changeTitle={userId => this.props.editTaskAssignee(userId,currentTask)}
      />
    )
  }
}

const mapStateToProps = (state,{ match }) => {
  const currentTask = match.params.taskId
  const users = getUserByTask(state,currentTask)
  const { assignee } = getTaskById(state,currentTask) || {} //in case it is undefined
  const { name:assigneeName } = getUserById(state,assignee) || {}
  return {
    users,
    currentTask,
    assigneeName,
  }
}

AssigneeTab = withRouter(
  connect(mapStateToProps,
    { editTaskAssignee }
  )(AssigneeTab)
)

export default AssigneeTab
