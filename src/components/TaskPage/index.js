import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import TableFilter from './TableFilter'
import TaskTable from './TaskTable'
import * as actions from 'actions'
import { getTaskById } from 'reducers'

class TaskPage extends React.Component {
  componentDidMount() {
    //加载的时候根据url的不同，加载不同的task，这里me和search需要persist to localStorage
    this.getTasks()
  }

  componentDidUpdate(prevProps) {
    const project1 = this.props.match.params.id
    const project2 = prevProps.match.params.id
    if (project1 && project2 && project1 !== project2) {
      this.getTasks()
    }
  }

  getTasks = () => {
    const {
      search,
      updateUserTasks,
      updateProjectTasks,
      searchTasks,
      history,
      match,
      me
    } = this.props
    const { id, taskId } = match.params

    const isValidTaskId = (id, tasks) => {
      if (tasks && tasks.filter(t => t.id === id).length > 0) {
        return true
      }
      return false
    }

    const updateSubIfAny = (taskId, tasks) => {
      console.log('updateSubIfAny', tasks)
      if (taskId && isValidTaskId(taskId, tasks)) {
        console.log('hahaha')
        this.getSubs(taskId)
      } else {
        console.log('haha')
        history.push(`/${id}`)
      }
    }

    if (id === 'search') {
      searchTasks(search)
      // .then(_ => this.getSubs(taskId))
      //why it is not thenable?
    } else if (id === me.id) {
      updateUserTasks(id).then(res => {
        updateSubIfAny(taskId, res.value)
      })
    } else {
      updateProjectTasks(id).then(res => {
        updateSubIfAny(taskId, res.value)
      })
    }
  }

  getSubs = taskId => {
    const { updateRootTask, updateSubtasks, task } = this.props
    // updateTaskById 之前使用了，但现在看来不知道为何使用。
    if (taskId) {
      updateSubtasks(taskId)
      if (task.rootTaskId) {
        updateRootTask(taskId)
      }
    }
  }

  render() {
    return (
      <div className="h-100 pt3 ph3 w-60">
        <TableFilter />
        {this.props.fetched
          ? <TaskTable />
          : <div className="w-100 h-taskTable bg-white shadow-1" />}
      </div>
    )
  }
}

const mapStateToProps = (state, { match }) => {
  const { taskId } = match.params
  return {
    search: state.search,
    taskId,
    task: getTaskById(state, taskId),
    me: state.me,
    fetched: state.tasks.taskFetched
  }
}

TaskPage = withRouter(connect(mapStateToProps, actions)(TaskPage))

export default TaskPage

// onScroll = e => {
//   if (e.target.scrollTop > 500) {
//     this.loadMore()
//   }
// }
