import React from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { getTaskById, getUserById } from 'reducers'
// import moment from 'moment'

class Stats extends React.Component {
  render() {
    const { task, getUser } = this.props
    const user = getUser(task.assignee) || { name: '' }
    return (
      <div className="Stats">
        {task.assignee &&
          task.createdAt &&
          <div>
            {user.name}创建于{task.createdAt.locale('zh-cn').fromNow()}
          </div>}
        {task.completedAt &&
          <div>完成于{task.completedAt.toString().substring(0, 10)}</div>}
      </div>
    )
  }
}

const mapStateToProps = (state, { match }) => {
  const currentTask = match.params.taskId
  const task = getTaskById(state, currentTask) || {}
  return {
    task,
    getUser: user => getUserById(state, user)
  }
}

Stats = withRouter(connect(mapStateToProps)(Stats))

export default Stats
