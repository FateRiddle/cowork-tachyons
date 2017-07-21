import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import Toolbar from './Toolbar'
import Relations from './Relations'
import Editor from './Editor'
import Progress from './Progress'
import Subtasks from './Subtasks'
import Stats from './Stats'
import { updateSubtasks, updateRootTask } from 'actions'
import { getTaskById, getSubtasks } from 'reducers'

class DetailPage extends React.Component {
  componentDidMount() {
    this.update()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentTask !== this.props.currentTask) {
      console.log('detailupdate')
      this.update()
    }
  }

  update = () => {
    const { updateSubtasks, updateRootTask, currentTask, task } = this.props
    if (currentTask && task && task.title) {
      updateSubtasks(currentTask)
      if (task.rootTaskId) {
        updateRootTask(currentTask)
      }
    }
  }

  render() {
    const {
      taskFetched,
      subtaskFetched,
      hasSubtask,
      task,
      subtasks,
      canEdit
    } = this.props
    return (
      <div className="w-40 mb2 mt3 mr2 shadow-1 bg-white">
        {taskFetched &&
          <div>
            <Toolbar canEdit={canEdit} />
            <Relations canEdit={canEdit} />
            <Editor task={task} canEdit={canEdit} />
            <Progress task={task} hasSubtask={hasSubtask} canEdit={canEdit} />
            {subtaskFetched && <Subtasks tasks={subtasks} canEdit={canEdit} />}
            <Stats />
          </div>}
      </div>
    )
  }
}

const mapStateToProps = (state, { match }) => {
  const currentTask = match.params.taskId
  const subtasks = getSubtasks(state)
  const task = getTaskById(state, currentTask)
  const canEdit =
    task && task.completed === 'active' && match.params.id !== 'search'
  const { taskFetched, subtaskFetched } = state.tasks
  return {
    taskFetched,
    subtaskFetched,
    currentTask,
    task,
    canEdit,
    subtasks,
    hasSubtask: subtasks.length > 0
  }
}

DetailPage = withRouter(
  connect(mapStateToProps, { updateSubtasks, updateRootTask })(DetailPage)
)

export default DetailPage
