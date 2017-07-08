import React from 'react'
import { connect } from 'react-redux'
import TaskPage from './TaskPage'
import DetailPage from './DetailPage'
import { updateUserTasks, searchTasks, updateSubtasks } from 'actions'

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
        if (taskId) {
          updateSubtasks(taskId)
        }
      })
    } else {
      updateUserTasks(id).then(_ => {
        if (taskId) {
          updateSubtasks(taskId)
        }
      })
    }
  }

  render() {
    const { match } = this.props
    // console.log('MainContent match',match);
    const { taskId } = match.params || ''
    return (
      <div className="MainContent">
        <TaskPage />
        {taskId && <DetailPage />}
      </div>
    )
  }
}

const mapStateToProps = ({ search }) => ({ search })

MainContent = connect(mapStateToProps, {
  updateUserTasks,
  searchTasks,
  updateSubtasks
})(MainContent)

export default MainContent
