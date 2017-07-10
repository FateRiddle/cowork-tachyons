import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { SortableHandle } from 'react-sortable-hoc'
import * as actions from 'actions'
import CheckIcon from './CheckIcon'
import classnames from 'classnames'
import { Dropdown } from 'semantic-ui-react'
import { getUserByTask } from 'reducers'

const DragHandle = SortableHandle(({ show }) =>
  <span className="DragHandle">
    {show ? '::' : ''}
  </span>
)
//为了简洁，注意所有的currentTask指的是currentSubtask
class TaskItem extends React.Component {
  state = { mouseOn: false }

  componentDidUpdate(prevProps, prevState) {
    const { currentTask, task } = this.props
    const prevTask = prevProps.currentTask
    if (prevTask !== currentTask && currentTask === task.id) {
      this.input.focus()
    }
  }
  //注意一定要在didUpdate里focus(),因为在render()结束后，ui才存在，focus()才有意义

  render() {
    const { match, task, me, style, currentTask } = this.props
    const id = task.id
    const isTitle = this.isTitle(task)
    const assignee = task.assignee ? task.assignee : '0'
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
          {false && //react-virtualized的下边界会挡住下拉框
            <Dropdown
              pointing="right"
              inline
              icon={null}
              upward={false}
              // className="Drop__assignee"
              value={assignee}
              options={this.getAssigneeOptions()}
              onChange={this.handleAssigneeChange}
            />}
          <Link to={`${task.id}`} onClick={this.toTaskDetail}>></Link>
        </span>
      </li>
    )
  }

  toTaskDetail = () => {
    this.props.changeCurrentTask(this.props.task.id)
  }

  getAssigneeOptions = () => {
    const { me, getUsers, task } = this.props
    const users = getUsers(task.id)
    let userArray = [{ id: '0', name: 'nobody' }]
    if (users.length > 0) {
      userArray = [...users, ...userArray] //add this to match when task is assigned to nobody
    } else {
      userArray = [me, ...userArray] //if task is created without a project, it can still assign to me.
    }
    return userArray.map(user => ({
      key: user.id,
      value: user.id,
      text: user.name
    }))
  }

  handleAssigneeChange = (e, data) => {
    const { editTaskAssignee, task } = this.props
    const assignee = data.value
    editTaskAssignee(assignee, task.id)
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
    const { currentTask, task } = this.props
    return classnames('TaskItem', {
      'TaskItem--selected': currentTask === task.id,
      'TaskItem--isTitle': this.isTitle(task)
    })
  }

  handleCheckIconClick = id => {
    this.props.toggleTask(id)
  }

  handleLineClick = () => {
    const { changeCurrentSubtask, task } = this.props
    console.log('item', task)
    changeCurrentSubtask(task.id)
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
    const {
      task: { id },
      taskIndex,
      upTaskId,
      deleteTask,
      insertSubtask
    } = this.props
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
          insertSubtask(upTaskId, id)
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

const mapStateToProps = (state, { match }) => ({
  completed: state.completed,
  search: state.search,
  me: state.me,
  currentTask: state.currentSubtask,
  upTaskId: match.params.taskId,
  getUsers: taskId => getUserByTask(state, taskId)
})

TaskItem = withRouter(connect(mapStateToProps, { ...actions })(TaskItem))

export default TaskItem

/* <Dropdown text="..." inline icon={null} pointing="left">
  <Dropdown.Menu>
    <Dropdown.Item
      text="modify"
      onClick={() => this.modifyProject(project.id)}
    />
    <Dropdown.Item
      text="delete"
      onClick={() => this.deleteProject(project.id)}
    />
  </Dropdown.Menu>
</Dropdown> */
