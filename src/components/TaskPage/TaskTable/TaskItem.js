import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { SortableHandle } from 'react-sortable-hoc'
import * as actions from 'actions'
import CheckIcon from './CheckIcon'
import classnames from 'classnames'
// import { Dropdown } from 'semantic-ui-react'
import { getUserById, getProjectByTask } from 'reducers'
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
    const {
      project,
      task,
      style,
      currentTask,
      me,
      match,
      assigneeName
    } = this.props
    const { id: currentProject } = match.params
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
          show={this.state.mouseOn || currentTask === task.id}
          onMouseEnterDrag={this.onMouseEnterDrag}
          onMouseLeaveDrag={this.onMouseLeaveDrag}
        />
        {!isTitle &&
          <CheckIcon
            completed={task.completed === 'completed'}
            onClick={() => this.handleCheckIconClick(task.id)}
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
          {task.upTaskId &&
            <span data-component="uptask" className="ph2 black-50">
              {`< `}<span className="f6">{task.upTaskTitle}</span>
            </span>}
          {!isTitle &&
            currentProject === me.id &&
            project &&
            project.title &&
            <span className="ph2 bg-black-10 br-pill f6 black-50">
              {project.title}
            </span>}
          {!isTitle &&
            <span
              className={classnames('ph2 f6', {
                orange: closeToDue,
                'dark-red': isDue
              })}
            >
              {task.dueAt ? task.dueAt.format().substring(5, 10) : ''}
            </span>}
          {!isTitle &&
            currentProject !== me.id &&
            assigneeName &&
            <div className="ph2 mr2 bg-black-10 br-pill f6 black-50">
              {assigneeName}
            </div>}
        </span>
      </li>
    )
  }

  //权限
  canEdit = () => {
    const { completed, match, me, task } = this.props
    return (
      task.completed === 'active' &&
      match.params.id !== 'search' &&
      (task.createdBy === me.id || task.assignee === me.id)
    )
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
    const {
      task: { progress, hasSubtask },
      toggleTask,
      changeMainWarning
    } = this.props
    if (!hasSubtask || (hasSubtask && progress === 100)) {
      toggleTask(id)
    } else {
      changeMainWarning('还有子任务未完成。')
    }
  }

  handleLineClick = () => {
    const { history, match, changeCurrentTask, task } = this.props
    console.log(task)
    const { id: projectId } = match.params
    const taskId = task.id
    changeCurrentTask(taskId)
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
    } else {
      this.props.changeMainWarning('此状态下任务不能编辑')
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
      task: { id, hasSubtask },
      taskIndex,
      deleteTask,
      insertTask,
      history,
      match,
      isOnly,
      changeMainWarning
    } = this.props
    switch (e.key) {
      case 'Tab':
        e.preventDefault()
        break
      case 'Backspace':
        if (e.target.value === '' && this.canEdit() && hasSubtask !== 1) {
          e.preventDefault()
          deleteTask(id)
          //第一行被删除是特例
          if (isOnly) {
            history.push(`/${match.params.id}`)
          }
          this.changeFocus(taskIndex, 'up')
        } else {
          changeMainWarning('此状态下任务不能编辑')
        }
        break
      case 'Enter':
        if (this.canEdit()) {
          e.preventDefault()
          const currentProject = this.props.match.params.id
          insertTask(currentProject, id)
          setTimeout(() => this.changeFocus(taskIndex, 'down'), 0)
        } else {
          changeMainWarning('此状态下不能插入任务')
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
  focusDown: PropTypes.func.isRequired
}

const mapStateToProps = (state, { match, task }) => {
  const { completed, search, me, currentTask } = state
  const user = getUserById(state, task.assignee)
  return {
    project: getProjectByTask(state, task),
    completed,
    search,
    me,
    currentTask,
    assigneeName: user ? user.name : ''
  }
}

const ConnectedTaskItem = withRouter(
  connect(mapStateToProps, actions)(TaskItem)
)

export default ConnectedTaskItem

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

// getAssigneeOptions = () => {
//   const { me, getUsers, task } = this.props
//   const users = getUsers(task.id)
//   let userArray = [{ id: '0', name: 'nobody' }]
//   if (users.length > 0) {
//     userArray = [...users, ...userArray] //add this to match when task is assigned to nobody
//   } else {
//     userArray = [me, ...userArray] //if task is created without a project, it can still assign to me.
//   }
//   return userArray.map(user => ({
//     key: user.id,
//     value: user.id,
//     text: user.name
//   }))
// }
//
// handleAssigneeChange = (e, data) => {
//   const { editTaskAssignee, task } = this.props
//   editTaskAssignee(data.value, task.id)
// }
