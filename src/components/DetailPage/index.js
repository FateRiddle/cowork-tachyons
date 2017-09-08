import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import Toolbar from './Toolbar'
import Relations from './Relations'
import Editor from './Editor'
import Progress from './Progress'
// import Tags from './Tags'
import Subtasks from './Subtasks'
import Stats from './Stats'
import * as actions from 'actions'
import { getTaskById, getSubtasks } from 'reducers'

class DetailPage extends React.Component {
  componentDidMount() {
    this.update()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentTask !== this.props.currentTask) {
      this.update()
    }
  }

  update = () => {
    const { updateSubtasks, updateRootTask, updateTaskById, currentTask, task, match } = this.props
    if (currentTask && match.params.id !== 'search') {
      updateTaskById(currentTask).then(_ => {
        if (task) {
          updateSubtasks(currentTask)
          if (task.rootTaskId) {
            updateRootTask(currentTask)
          }
        }
      })
    }
  }

  render() {
    const {
      taskFetched,
      detailFetched,
      subtaskFetched,
      hasSubtask,
      task,
      subtasks,
      canEdit,
      hidden,
    } = this.props
    return (
      <div
        className={`absolute static-ns w-100 h-100 h-auto-ns border-box mb2 mt1 mt3-ns mr2 shadow-1 bg-white ${hidden
          ? 'w-70-ns'
          : 'w-40-ns'}`}
      >
        {taskFetched &&
        detailFetched && (
          <div className="h-100 flex flex-column">
            <Toolbar canEdit={canEdit} />
            <main className="h-100 overflow-y-auto">
              <Relations canEdit={canEdit} />
              <Editor task={task} canEdit={canEdit} />
              <Progress task={task} hasSubtask={hasSubtask} canEdit={canEdit} />
              {/* <Tags task={task} canEdit={canEdit} /> */}
              {subtaskFetched && <Subtasks tasks={subtasks} />}
              <Stats />
            </main>
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = (state, { match }) => {
  const currentTask = match.params.taskId
  const subtasks = getSubtasks(state)
  const task = getTaskById(state, currentTask)
  const canEdit =
    task &&
    task.completed === 'active' &&
    match.params.id !== 'search' &&
    (task.createdBy === state.me.id || task.assignee === state.me.id)
  const { taskFetched, detailFetched, subtaskFetched } = state.tasks
  return {
    taskFetched,
    detailFetched,
    subtaskFetched,
    currentTask,
    task,
    canEdit,
    subtasks,
    hasSubtask: subtasks.length > 0,
    hidden: state.visual.taskPageHidden,
  }
}

DetailPage = withRouter(connect(mapStateToProps, actions)(DetailPage))

export default DetailPage
