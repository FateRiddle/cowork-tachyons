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
    const { addSubtask, match, canEdit } = this.props
    const taskId = match.params.taskId || ''
    return (
      <div
        className="relative flex items-center h3 bb b--black-30"
        data-component="Toolbar"
      >
        <AssigneeTab disabled={!canEdit} />
        <DueDateTab disabled={!canEdit} />
        <div
          className={`ml2 ph2 ${canEdit
            ? 'pointer hover-thin-blue'
            : ''} black-50`}
          onClick={_ => {
            if (canEdit) {
              addSubtask(taskId)
            }
          }}
        >
          添加子任务
        </div>
        <div
          className="absolute right-0 pt2 pr3 self-start black-60 pointer dim"
          data-component="close"
          onClick={this.close}
        >
          X
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ completed }) => ({ completed })

const ConnectedToolbar = withRouter(
  connect(mapStateToProps, { addSubtask })(Toolbar)
)

export default ConnectedToolbar
