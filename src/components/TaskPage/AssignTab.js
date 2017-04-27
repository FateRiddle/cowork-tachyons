import React from 'react'
import { connect } from 'react-redux'
import { getUserById,getTaskById,getUserByTask } from '../../reducers'
import { editTaskAssignee } from '../../actions'

class AssignTab extends React.Component {

  state = { hidden:true }

  toggleList = () => {
    this.setState({hidden:!this.state.hidden},()=>{console.log(this.state)})
  }

  handleListClick = (assignee) => {
    const { editTaskAssignee,taskId } = this.props
    editTaskAssignee(assignee,taskId)
  }

  render() {
    const { user,task,groupUsers } = this.props
    return (
      <span
        className='AssignTab'
        onClick={this.toggleList}
      >
        <span>{task.assignee?user.name:'assign'}</span>
        {
          !this.state.hidden && (
            <ul className='AssignTab__dropList'>
              {
                groupUsers.map(user => (
                  <li key={user.id}
                    onClick={()=>this.handleListClick(user.id)}
                  >
                    {user.name}
                  </li>
                ))
              }
              <li onClick={()=>this.props.editTaskAssignee('',task.id)}>nobody</li>
            </ul>
          )
        }
      </span>
    )
  }
}

AssignTab.propTypes = {
  taskId: React.PropTypes.string
}

const mapStateToProps = (state,{ taskId }) => {
  const task = getTaskById(state,taskId)
  return {
    task,
    user: getUserById(state,task.assignee),
    groupUsers: getUserByTask(state,taskId)
  }
}

AssignTab = connect(mapStateToProps, {editTaskAssignee})(AssignTab)

export default AssignTab
