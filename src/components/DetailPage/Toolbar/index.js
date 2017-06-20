import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import AssigneeTab from './AssigneeTab'
import DueDateTab from './DueDateTab'
import { addSubtask } from 'actions'

class Toolbar extends React.Component {

  close = () => {
    this.props.history.push('')
  }

  render(){
    const { addSubtask,match } = this.props
    const taskId = match.params.taskId || ''
    return <div className='Toolbar'>
      <AssigneeTab />
      <DueDateTab />
      <div className="SubTaskTab" onClick={() => addSubtask(taskId)}>子任务</div>
      <div className='Toolbar__closeButton' onClick={this.close}>X</div>
    </div>
  }
}

Toolbar = withRouter(
  connect(null,{ addSubtask })(Toolbar)
)

export default Toolbar
