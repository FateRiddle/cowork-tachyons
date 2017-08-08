import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
// import { Icon } from 'semantic-ui-react'
import AssigneeTab from './AssigneeTab'
import DueDateTab from './DueDateTab'
import { addSubtask, havingSubtask } from 'actions'

class Toolbar extends React.Component {
  close = () => {
    this.props.history.push('')
  }

  render() {
    const { addSubtask, havingSubtask, match, canEdit } = this.props
    const taskId = match.params.taskId || ''
    return (
      <div className="relative w-100 flex items-center h3 bb b--black-30" data-component="Toolbar">
        <AssigneeTab disabled={!canEdit} />
        <DueDateTab disabled={!canEdit} />
        {/* <Icon
          className="black-50 hover-thin-blue ph4 pointer"
          name="tag"
          size="large"
        /> */}
        <div
          className={`ml2 ph2 ${canEdit ? 'pointer hover-thin-blue' : ''} black-50`}
          onClick={_ => {
            if (canEdit) {
              addSubtask(taskId)
              havingSubtask(taskId)
            }
          }}
        >
          添加子任务
        </div>
        <div
          className="absolute right-0 pt2 pr3 self-start black-60 f4 pointer hover-thin-blue"
          data-component="close"
          onClick={this.close}
        >
          x
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ completed }) => ({ completed })

const ConnectedToolbar = withRouter(
  connect(mapStateToProps, { addSubtask, havingSubtask })(Toolbar)
)

export default ConnectedToolbar
