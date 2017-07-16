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

  render() {
    const { addSubtask, match } = this.props
    const taskId = match.params.taskId || ''
    return (
      <div
        className="relative flex items-center h3 bb b--black-30"
        data-component="Toolbar"
      >
        <AssigneeTab />
        <DueDateTab />
        <div
          className="ml2 ph2 pointer black-50 hover-thin-blue"
          onClick={() => addSubtask(taskId)}
        >
          添加子任务
        </div>
        <div
          className="absolute right-0 pt2 pr3 self-start black-60 dim"
          data-component="close"
          onClick={this.close}
        >
          X
        </div>
      </div>
    )
  }
}

Toolbar = withRouter(connect(null, { addSubtask })(Toolbar))

export default Toolbar
