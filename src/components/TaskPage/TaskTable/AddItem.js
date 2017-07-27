import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { addTask } from 'actions'
import { getFilteredTasks } from 'reducers'

class AddItem extends React.Component {
  canEdit = () => {
    const { completed, match } = this.props
    return completed === 'active' && match.params.id !== 'search'
  }

  AddTask = () => {
    const { addTask, match } = this.props
    if (this.canEdit()) {
      const currentProject = match.params.id
      addTask(currentProject)
      setTimeout(() => this.focusLast(), 0)
    }
  }

  focusLast = () => {
    const { tasks, history, match } = this.props
    const lastId = tasks[tasks.length - 1].id
    if (match.params.taskId) {
      history.push(`${lastId}`)
    } else {
      history.push(`${match.url}/${lastId}`)
    }
  }

  render() {
    const { tasks, style } = this.props
    let msg = ''
    if (this.canEdit()) {
      if (tasks.length === 0) {
        msg = '点击添加新任务'
      } else if (tasks.length < 2) {
        msg = '选择一行回车'
      }
    }
    return (
      <li className="list pa2 pointer" style={style} onClick={this.AddTask}>
        {msg}
      </li>
    )
  }
}

// AddItem.propTypes = {
//   focusLast: React.PropTypes.func.isRequired,
//   listLength: React.PropTypes.number.isRequired,
// }

const mapStateToProps = (state, { match }) => {
  const { completed, search } = state
  return {
    tasks: getFilteredTasks(state, match.params.id),
    completed,
    search
  }
}

AddItem = withRouter(connect(mapStateToProps, { addTask })(AddItem))

export default AddItem
