import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { SortableHandle } from 'react-sortable-hoc'
import * as actions from 'actions'
import CheckIcon from './CheckIcon'
import classnames from 'classnames'
import { Icon } from 'semantic-ui-react'
import { getUserById } from 'reducers'
import moment from 'moment'

const DragHandle = SortableHandle(
  ({ show, onMouseEnterDrag, onMouseLeaveDrag }) =>
    <span
      className="f4 w15 tc pointer b black-60 hover-thin-blue"
      onMouseEnter={onMouseEnterDrag}
      onMouseLeave={onMouseLeaveDrag}
    >
      {show ? '::' : ''}
    </span>
)
//为了简洁，注意所有的currentTask指的是currentSubtask
class TaskItem extends React.Component {
  state = { mouseOn: false, mounseOnDrag: false }

  componentDidUpdate(prevProps, prevState) {
    const { currentTask, task } = this.props
    const prevTask = prevProps.currentTask
    if (prevTask !== currentTask && currentTask === task.id) {
      this.input.focus()
    }
  }
  //注意一定要在didUpdate里focus(),因为在render()结束后，ui才存在，focus()才有意义

  render() {
    const { task, style, currentTask, assigneeName } = this.props
    const { id } = task
    const isTitle = this.isTitle(task)
    //due warnings
    const diff = task.dueAt && task.dueAt.diff(moment(), 'days', true)
    const isDue = diff < 0
    const closeToDue = diff < 1.5 && diff >= 0
    return (
      <li
        className={this.calcClassName()}
        style={style}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <DragHandle
          show={this.state.mouseOn || currentTask === id}
          onMouseEnterDrag={this.onMouseEnterDrag}
          onMouseLeaveDrag={this.onMouseLeaveDrag}
        />
        {!isTitle &&
          <CheckIcon
            completed={task.completed === 'completed'}
            onClick={() => this.handleCheckIconClick(id)}
          />}
        <span className="flex-auto flex">
          <input
            className="bn outline-0 flex-auto"
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
            <span
              className={classnames('ph2 f6', {
                orange: closeToDue,
                'dark-red': isDue
              })}
            >
              {task.dueAt ? task.dueAt.format().substring(5, 10) : ''}
            </span>}
          {assigneeName &&
            <div className="ph2 bg-black-10 br-pill f6 black-50">
              {assigneeName}
            </div>}
          <Link
            className="pl2 black-50 hover-thin-blue f3 flex-center"
            to={`${task.id}`}
            onClick={this.toTaskDetail}
          >
            <Icon name="chevron right" size="tiny" />
          </Link>
        </span>
      </li>
    )
  }

  toTaskDetail = () => {
    this.props.changeCurrentTask(this.props.task.id)
  }

  calcClassName = () => {
    const { currentTask, task } = this.props
    return classnames('flex bb b--black-10 box-sizing items-center', {
      'bt bb b--cyan': currentTask === task.id, //selected
      b: this.isTitle(task),
      'shadow-1': this.state.mouseOnDrag,
      'black-50': task.completed === 'completed'
    })
  }

  onMouseEnter = () => this.setState({ mouseOn: true })
  onMouseLeave = () => this.setState({ mouseOn: false })
  onMouseEnterDrag = () => this.setState({ mouseOnDrag: true })
  onMouseLeaveDrag = () => this.setState({ mouseOnDrag: false })

  isTitle = task => {
    if (task && task.title) {
      const titleLast = task.title.substring(task.title.length - 1)
      return titleLast === '：' || titleLast === ':'
    }
    return false
  }

  handleCheckIconClick = id => {
    this.props.toggleTask(id)
  }

  handleLineClick = () => {
    const { changeCurrentSubtask, task } = this.props
    console.log('item', task, this.props.canEdit)
    changeCurrentSubtask(task.id)
  }

  handleTitleChange = e => {
    if (this.props.canEdit) {
      const title = e.target.value
      const { task: { id }, editTaskTitle } = this.props
      editTaskTitle(title, id)
    }
  }

  handleBlur = e => {
    const title = e.target.value
    const { task: { id }, saveTaskTitle } = this.props
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
    const {
      task: { id, upTaskId },
      taskIndex,
      deleteSubtask,
      insertSubtask,
      match
    } = this.props
    switch (e.key) {
      case 'Tab':
        e.preventDefault()
        break
      case 'Backspace':
        if (e.target.value === '' && this.props.canEdit) {
          e.preventDefault()
          deleteSubtask(id, upTaskId)
          this.changeFocus(taskIndex, 'up') // TODO: 第一行被删除是特例，考虑简洁的写法
        }
        break
      case 'Enter':
        if (this.props.canEdit) {
          e.preventDefault()
          insertSubtask(match.params.taskId, id)
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
  task: PropTypes.object.isRequired,
  focusUp: PropTypes.func.isRequired,
  focusDown: PropTypes.func.isRequired,
  canEdit: PropTypes.bool.isRequired
}

const mapStateToProps = (state, { task }) => {
  const { completed, search, currentSubtask } = state
  const user = getUserById(state, task.assignee)
  return {
    completed,
    search,
    currentTask: currentSubtask,
    assigneeName: user ? user.name : ''
  }
}

const ConnectedTaskItem = withRouter(
  connect(mapStateToProps, actions)(TaskItem)
)

export default ConnectedTaskItem
