import React from 'react'
import { connect } from 'react-redux'
import { editTaskAssignee } from '../../../actions'

class AssigneeTab extends React.Component {
  state = {assigneeList:false}

  toggleAssigneeList = () => {
    this.setState({assigneeList:!this.state.assigneeList})
  }

  unassign = () => {
    const { currentTask,editTaskAssignee } = this.props
    editTaskAssignee('',currentTask)
  }

  assign = assignee => {
    const { currentTask,editTaskAssignee } = this.props
    editTaskAssignee(assignee,currentTask)
  }

  render() {
    const { users,assignee } = this.props
    let userName = ''
    if(assignee !== '' && users.allIds.indexOf(assignee) > -1){
      userName = users.byId[assignee].name
    }

    return (
      assignee === ''?
        <div>
          <div onClick={this.toggleAssigneeList} >unassigned</div>
          {
            this.state.assigneeList?
            <ul>
            {
              users.allIds.map(id => {
                const { qq,name } = users.byId[id]
                return <li key={id} onClick={()=>this.assign(qq)}>{name}</li>
              })
            }
            </ul>:null
          }
        </div>
        :
        <div>{userName}
          <span onClick={this.unassign}> X </span>
        </div>
    )
  }
}

const mapStateToProps = ({ currentTask,users,tasks }) => ({
  currentTask,
  users,
  assignee:tasks.byId[currentTask].assignee,
})

AssigneeTab = connect(mapStateToProps,{
  editTaskAssignee,
})(AssigneeTab)

export default AssigneeTab
