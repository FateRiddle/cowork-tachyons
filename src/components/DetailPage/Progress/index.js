import React from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import * as actions from 'actions'
import { Dropdown, Progress } from 'semantic-ui-react'

class ProgressSection extends React.Component {
  options = [
    { key: 1, text: '半天', value: 0.5 },
    { key: 2, text: '1天', value: 1 },
    { key: 3, text: '1天半', value: 1.5 },
    { key: 4, text: '2天', value: 2 },
    { key: 5, text: '3天', value: 3 },
    { key: 6, text: '4天', value: 4 },
    { key: 7, text: '5天', value: 5 },
    { key: 8, text: '6天', value: 6 },
    { key: 9, text: '7天', value: 7 }
  ]

  progressColor = () => {
    const { progress } = this.props
    switch (true) {
      case progress >= 25 && progress < 50:
        return 'red'
      case progress >= 50 && progress < 75:
        return 'yellow'
      case progress >= 75 && progress < 100:
        return 'olive'
      case progress === 100:
        return 'green'
      default:
        return
    }
  }

  increaseProgress = () => {
    const {
      currentTask,
      progress,
      editTaskProgress,
      hasSubtask,
      canEdit
    } = this.props
    if (hasSubtask || !canEdit) {
      return
    }
    if (progress === 100) {
      editTaskProgress(0, currentTask)
    } else {
      editTaskProgress(progress + 25, currentTask)
    }
  }

  changeAmount = (e, data) => {
    const amount = data.value
    const { currentTask, editTaskAmount } = this.props
    editTaskAmount(amount, currentTask)
  }

  render() {
    const { progress, amount, hasSubtask, canEdit } = this.props
    const editable = canEdit && !hasSubtask
    return (
      <div className="ph3">
        <div className="mr3 pv1 flex">
          <div className="black-50 pr2">工作量：</div>
          {editable
            ? <Dropdown
                className="pb2 tracked-mega black-50 hover-thin-blue"
                value={amount}
                options={this.options}
                onChange={this.changeAmount}
              />
            : <div className="pb2 tracked-mega black-50">{amount}天</div>}
        </div>
        <div className="flex pv1">
          <div className="black-50 pr2">进度：</div>
          <Progress
            className={`w5 ${editable ? 'pointer' : ''}`}
            onClick={this.increaseProgress}
            percent={progress}
            onBlur={this.saveProgress}
            progress
            color={this.progressColor()}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, { task }) => {
  const getProgress = task =>
    task.completed === 'completed' ? 100 : task.progress || 0
  return {
    currentTask: task.id,
    progress: Math.floor(getProgress(task)),
    amount: task.amount || 1,
    completed: state.completed
  }
}

const ConnectedProgressSection = withRouter(
  connect(mapStateToProps, actions)(ProgressSection)
)

export default ConnectedProgressSection
