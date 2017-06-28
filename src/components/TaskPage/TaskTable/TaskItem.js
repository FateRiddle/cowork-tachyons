import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { SortableHandle } from 'react-sortable-hoc'
import * as actions from 'actions'
import CheckIcon from './CheckIcon'
import AssignTab from './AssignTab'
import classnames from 'classnames'
// import { Dropdown } from 'semantic-ui-react'

const DragHandle = SortableHandle(({ show }) =>
  <span className="DragHandle">
    {show ? '::' : ''}
  </span>
)

class TaskItem extends React.Component {
  state = { mouseOn: false }

  componentDidUpdate(prevProps, prevState) {
    const nextTaskId = this.props.match.params.taskId
    const thisTaskId = prevProps.match.params.taskId
    if (thisTaskId !== nextTaskId && nextTaskId === this.props.task.id) {
      this.input.focus()
    }
  }
  //注意一定要在didUpdate里focus(),因为在render()结束后，ui才存在，focus()才有意义

  render() {
    const { match, task, me, style } = this.props
    const id = task.id
    const { id: currentProject, taskId: currentTask } = match.params
    // console.log(currentTask,currentProject);
    const isTitle = this.isTitle(task)
    return (
      <li
        className={this.calcClassName()}
        style={style}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <DragHandle show={this.state.mouseOn || currentTask === id} />
        {!isTitle &&
          <CheckIcon
            completed={task.completed === 'completed'}
            onClick={() => this.handleCheckIconClick(id)}
          />}
        <span className="TaskItem__title">
          <input
            value={task.title || ''}
            ref={node => {
              this.input = node
            }}
            onClick={this.handleLineClick}
            onChange={this.handleTitleChange}
            onKeyDown={this.handleKeyDown}
            onBlur={this.handleBlur}
          />
          {!isTitle &&
            <span className="TaskItem__dueAt">
              {task.dueAt ? task.dueAt.format().substring(5, 10) : ''}
            </span>}
          {currentProject !== me.id && <AssignTab taskId={id} />}
        </span>
      </li>
    )
  }

  canEdit = () => {
    const { completed, match } = this.props
    return completed === 'active' && match.params.id !== 'search'
  }

  onMouseEnter = () => this.setState({ mouseOn: true })

  onMouseLeave = () => this.setState({ mouseOn: false })

  isTitle = task => {
    if (task && task.title) {
      const titleLast = task.title.substring(task.title.length - 1)
      return titleLast === '：' || titleLast === ':'
    }
    return false
  }

  calcClassName = () => {
    const currentTask = this.props.match.params.taskId
    const { task } = this.props
    return classnames('TaskItem', {
      'TaskItem--selected': currentTask === task.id,
      'TaskItem--isTitle': this.isTitle(task)
    })
  }

  handleCheckIconClick = id => {
    this.props.toggleTask(id)
  }

  handleLineClick = () => {
    const { history, match } = this.props
    const { id: projectId } = match.params
    const taskId = this.props.task.id
    console.log(taskId)
    if (projectId === 'search') {
      history.push(`/search/${taskId}`)
    } else {
      history.push(`/${projectId}/${taskId}`)
    }
  }

  handleTitleChange = e => {
    if (this.canEdit()) {
      const title = e.target.value
      const { task: { id }, editTaskTitle } = this.props
      editTaskTitle(title, id)
    }
  }

  handleBlur = e => {
    const title = e.target.value
    const { task: { id }, saveTaskTitle } = this.props
    console.log(title)
    saveTaskTitle(title, id)
  }

  changeFocus = (index, direction) => {
    const { focusUp, focusDown } = this.props

    switch (direction) {
      case 'up':
        focusUp(index)
        break
      case 'down':
        focusDown(index)
        break
      default:
        return
    }
  }

  handleKeyDown = e => {
    const { task: { id }, taskIndex, deleteTask, insertTask } = this.props
    switch (e.key) {
      case 'Tab':
        e.preventDefault()
        break

      case 'Backspace':
        if (e.target.value === '' && this.canEdit()) {
          e.preventDefault()
          deleteTask(id)
          this.changeFocus(taskIndex, 'up') // TODO: 第一行被删除是特例，考虑简洁的写法
        }
        break

      case 'Enter':
        if (this.canEdit()) {
          e.preventDefault()
          const currentProject = this.props.match.params.id
          insertTask(currentProject, id)
          setTimeout(() => this.changeFocus(taskIndex, 'down'), 0)
        }
        break

      case 'ArrowUp':
        e.preventDefault()
        this.changeFocus(taskIndex, 'up')
        break

      case 'ArrowDown':
        e.preventDefault()
        this.changeFocus(taskIndex, 'down')
        break

      default:
        return
    }
  }
}

TaskItem.propTypes = {
  task: React.PropTypes.object.isRequired,
  focusUp: React.PropTypes.func.isRequired,
  focusDown: React.PropTypes.func.isRequired
}

const mapStateToProps = ({ completed, search, me }) => ({
  completed,
  search,
  me
})

TaskItem = withRouter(connect(mapStateToProps, { ...actions })(TaskItem))

export default TaskItem
