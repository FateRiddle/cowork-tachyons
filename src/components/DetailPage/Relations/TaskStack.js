import React from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { changeCurrentTask } from 'actions'
import { getTaskById, getTaskStack } from 'reducers'

class TaskStack extends React.Component {
  onClick = id => {
    this.props.changeCurrentTask(id)
  }
  render() {
    const { id, ids, getTask } = this.props
    return (
      <ul>
        {ids.map(id =>
          <li key={id}>
            <Link onClick={() => this.onClick(id)} to={id}>
              {getTask(id).title} >
            </Link>
          </li>
        )}
      </ul>
    )
  }
}

const mapStateToProps = (state, { id }) => {
  return {
    getTask: taskId => getTaskById(state, taskId),
    ids: getTaskStack(state, id)
  }
}

TaskStack = withRouter(
  connect(mapStateToProps, { changeCurrentTask })(TaskStack)
)

export default TaskStack
