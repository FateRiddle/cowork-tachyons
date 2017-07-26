import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import Task from './Task'
import * as actions from 'actions'
import { getAlltasks } from 'reducers'

class TaskReport extends React.Component {
  render() {
    const { allIds } = this.props
    return (
      allIds.length > 0 &&
      <ul
        className="h-100 pt3 ph3 bg-white shadow-1 overflow-y-auto"
        data-component="TaskReport"
      >
        {allIds.map((id, index) =>
          <Task key={index} taskId={id} gray={false} />
        )}
      </ul>
    )
  }
}

const mapStateToProps = state => {
  const tasks = getAlltasks(state).filter(t => !t.upTaskId)
  return {
    allIds: tasks.map(t => t.id)
  }
}

const ConnectedTaskReport = withRouter(
  connect(mapStateToProps, actions)(TaskReport)
)

export default ConnectedTaskReport
