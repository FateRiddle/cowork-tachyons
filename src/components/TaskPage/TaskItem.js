import React from 'react'
import { connect } from  'react-redux'
import { withRouter } from 'react-router'
import { SortableElement,SortableHandle } from 'react-sortable-hoc'
import * as actions from '../../actions'
import { me } from '../../data'
import { isEmpty } from 'lodash'

const DragHandle = SortableHandle(({ show }) => <td className='DragHandle'>
  {show?'::':''}
</td>)

class TaskItem extends React.Component {

  state = {mouseOn:false, isFocus:false}

  //life cycle 解决focus的问题
  componentWillReceiveProps(nextProps) {
    const nextTaskId = nextProps.match.params.taskId
    this.setFocus(nextTaskId)
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.state.isFocus){
      this.input.focus()
    }
  }

  canEdit = () => {
    const { completed,search } = this.props
    return completed === 'active' && isEmpty(search)
  }

  setFocus = (nextTaskId) => {
    const taskId = this.props.match.params.taskId
    const { id } = this.props.task
    if(this.state.isFocus){
      this.setState({isFocus:false})
    }
    if(taskId && nextTaskId && taskId !== nextTaskId){//url有变化
      if(id === nextTaskId) { //url到了这个TaskItem
        this.setState({isFocus:true})//这里不能直接控制focus，因为还没有render,DOM不存在
      }
    }
  }

  isTitle = task => {
    if(task){
      const titleLast = task.title.substring(task.title.length-1)
      return titleLast === "：" || titleLast === ":"
    }
    return false
  }

  calcClassName = (className) => {
    const currentTask = this.props.match.params.taskId
    const { task } = this.props
    if(currentTask === task.id){
      className += ' TaskItem--selected'
    }
    if(this.isTitle(task)){
      className += ' TaskItem--isTitle'
    }
    return className
  }

  handleCheckIconClick = id => {
    this.props.toggleTask(id)
  }

  handleLineClick = () => {
    const { task:{ id },history } = this.props
    history.push(`${id}`)
  }

  handleTitleChange = e => {
    if(this.canEdit()){
      const title = e.target.value
      const { task:{ id },editTaskTitle } = this.props
      editTaskTitle(title,id)
    }
  }

  handleFocus = (id,direction) => {

    const { focusUp,focusDown } = this.props

    switch (direction) {
      case 'up':
        focusUp(id)
        break
      case 'down':
        focusDown(id)
        break
      default:
        return
    }
  }

  handleKeyDown = e => {
    const {
      task:{ id },
      deleteTask, insertTask,
    } = this.props
    switch (e.key) {
      case "Tab":
        e.preventDefault()
      break

      case "Backspace":
        if(e.target.value === '' && this.canEdit()){
          e.preventDefault()
          deleteTask(id)
          this.handleFocus(id,'up')   // TODO: 第一行被删除是特例，考虑简洁的写法
        }
      break

      case "Enter":
        if(this.canEdit()){
          e.preventDefault()
          const currentProject = this.props.match.params.id
          insertTask(currentProject,id)
          setTimeout(()=>this.handleFocus(id,'down'),0)
        }
      break

      case "ArrowUp":
        e.preventDefault()
        this.handleFocus(id,'up')
      break

      case "ArrowDown":
        e.preventDefault()
        this.handleFocus(id,'down')
      break

      default:
        return
    }
  }

  render() {
    const { match,task } = this.props
    const id = task.id
    const { id:currentProject, taskId:currentTask } = match.params
    // console.log(currentTask,currentProject);
    const isTitle = this.isTitle(task)
    return (
      <tr className={this.calcClassName("TaskItem")}
        onMouseEnter={()=>this.setState({mouseOn:true})}
        onMouseLeave={()=>this.setState({mouseOn:false})}
      >
        <DragHandle show={this.state.mouseOn||currentTask === id} />
        {
          isTitle?null:<td className="CheckIcon" onClick={()=>this.handleCheckIconClick(id)}></td>
        }
        <td className='TaskTitle'>
          <input value={task.title || ''}
            ref={node => this.input = node}
            onClick={this.handleLineClick}
            onChange={this.handleTitleChange}
            onKeyDown={this.handleKeyDown}
          />
          {
            isTitle?null:
            <span>{task.dueDate?task.dueDate.format('MM-DD'):''}</span>
          }
          {
            currentProject === me.id?null:
            <span>Assign</span>
          }
        </td>
      </tr>
    )
  }
}

TaskItem.propTypes = {
  task: React.PropTypes.object.isRequired,
  focusUp: React.PropTypes.func.isRequired,
  focusDown: React.PropTypes.func.isRequired,
}

const mapStateToProps = ({ completed,search }) => ({
  completed,
  search,
})

TaskItem = withRouter(
  connect(mapStateToProps,
    {...actions}
  )(TaskItem)
)

//转换成可拖拽的item
const SortableTaskItem = SortableElement(({
  task,focusDown,focusUp,
}) => <TaskItem task={task} focusDown={focusDown} focusUp={focusUp} />)

export default SortableTaskItem
