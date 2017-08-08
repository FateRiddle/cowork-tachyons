import React from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { getTaskById, getUserById } from 'reducers'
// import moment from 'moment'

class Stats extends React.Component {
  render() {
    const { task, creator } = this.props
    return (
      <div className="ph3 pv2 black-50" data-component="Stats">
        {creator &&
          task.beginAt &&
          <div>
            {creator.name}创建。开始于{task.beginAt.locale('zh-cn').fromNow()}。
          </div>}
        {task.completedAt &&
          <div>
            完成于{task.completedAt.locale('zh-cn').fromNow()}。
          </div>}
      </div>
    )
  }
}

const mapStateToProps = (state, { match }) => {
  const currentTask = match.params.taskId
  const task = getTaskById(state, currentTask) || {}
  const creator = getUserById(state, task.createdBy) || {}
  return {
    task,
    creator,
  }
}

Stats = withRouter(connect(mapStateToProps)(Stats))

export default Stats
