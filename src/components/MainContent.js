import React from 'react'
import { connect } from 'react-redux'
import TaskPage from './TaskPage'
import DetailPage from './DetailPage'
import * as actions from 'actions'
import { getTaskById } from 'reducers'

class MainContent extends React.Component {
  componentDidMount() {
    //加载的时候根据url的不同，加载不同的task，这里me和search需要persist to localStorage
    const {
      search,
      updateUserTasks,
      searchTasks,
      updateSubtasks,
      match
    } = this.props
    const { id, taskId } = match.params
    if (id === 'search') {
      searchTasks(search).then(_ => {
        this.updateSubs(taskId)
      })
    } else {
      updateUserTasks(id).then(_ => {
        this.updateSubs(taskId)
      })
    }
  }

  updateSubs = taskId => {
    const { updateRootTask, updateSubtasks, updateTaskById } = this.props
    const updateRoot = () => {
      if (this.props.getTask(taskId).rootTaskId) {
        updateRootTask(taskId)
      }
    }
    if (taskId) {
      updateSubtasks(taskId)
      if (this.props.getTask(taskId)) {
        updateRoot()
      } else {
        updateTaskById(taskId).then(_ => {
          updateRoot()
        })
      }
    }
  }

  render() {
    const { match } = this.props
    // console.log('MainContent match',match);

    const { taskId } = match.params || ''
    return (
      <div className="w-100 vh-fit bg-pale-grey border-box flex justify-center">
        <TaskPage />
        {taskId && <DetailPage />}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  getTask: id => getTaskById(state, id),
  search: state.search
})

MainContent = connect(mapStateToProps, {
  ...actions
})(MainContent)

export default MainContent
