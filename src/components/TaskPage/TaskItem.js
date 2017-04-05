import React from 'react'
import { connect } from  'react-redux'
import { withRouter } from 'react-router'
// import Link from '../parts/Link'
import { SortableElement,SortableHandle } from 'react-sortable-hoc'
import * as actions from '../../actions'

const DragHandle = SortableHandle(({ focused }) => <td className='DragHandle'>
  {focused?'::':''}
</td>)

class TaskItem extends React.Component {

  state = {mouseOver:false}

  componentDidMount() {
    console.log(this.props.location);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(prevProps.location,this.props.location);
  }

  isTitle = task => {
    if(task && this.props.currentProject === 'me'){
      const titleLast = task.title.substring(task.title.length-1)
      return titleLast === "：" || titleLast === ":"
    }
    return false
  }

  calcClassName = (className) => {
    const { currentTask,id,tasks } = this.props
    const task = tasks.byId[id]
    if(currentTask === id){
      className += ' selected'
    }
    if(this.isTitle(task)){
      className += ' isTitle'
    }
    return className
  }

  handleCheckIconClick = id => {
    this.props.toggleTask(id)
  }

  handleLineClick = () => {
    const { id,history } = this.props
    history.push(`${id}`)
  }

  handleTitleChange = title => {
    const { id,editTaskTitle } = this.props
    editTaskTitle(title,id)
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
      id,
      currentProject,currentUser,
      deleteTask, insertTaskForMe, insertTaskForProject,
    } = this.props

    switch (e.key) {
      case "Tab":
        e.preventDefault()
      break

      case "Backspace":
        console.log('Backspace');
        if(e.target.value === ''){
          e.preventDefault()
          deleteTask(id)
          this.handleFocus(id,'up')
        }
      break

      case "Enter":
        e.preventDefault()
        if(currentProject === 'me'){
          insertTaskForMe(currentUser,id)
        } else {
          insertTaskForProject(currentProject,id)
        }
        setTimeout(()=>this.handleFocus(id,'down'),0)


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
    const { tasks,id,match } = this.props

    const { id:currentProject, taskId:currentTask } = match.params
    // console.log(currentTask,currentProject);
    const task = tasks.byId[id]
    const isTitle = this.isTitle(task)
    return (
      <tr className={this.calcClassName("TaskItem")}
        onMouseEnter={()=>this.setState({mouseOver:true})}
        onMouseLeave={()=>this.setState({mouseOver:false})}
      >
        <DragHandle focused={this.state.mouseOver||currentTask === id} />
        {
          isTitle?null:<td className="CheckIcon" onClick={()=>this.handleCheckIconClick(id)}></td>
        }
        <td className='TaskTitle'>
          <input value={task.title || ''}
            ref={node => this.input = node}
            onClick={this.handleLineClick}
            onChange={e => this.handleTitleChange(e.target.value)}
            onKeyDown={e => this.handleKeyDown(e)}
          />
          {
            isTitle?null:
            <span>{task.dueDate?task.dueDate.format('MM-DD'):''}</span>
          }
          {
            currentProject === '3'?null:
            <span>Assign</span>
          }
        </td>
      </tr>
    )
  }
}

TaskItem.propTypes = {
  id: React.PropTypes.string.isRequired,
  focusUp: React.PropTypes.func.isRequired,
  focusDown: React.PropTypes.func.isRequired,
}

const mapStateToProps = ({ tasks,currentUser }) => ({
  tasks,
  currentUser,
})

TaskItem = withRouter(
  connect(mapStateToProps,
    {...actions}
  )(TaskItem)
)

//转换成可拖拽的item
const SortableTaskItem = SortableElement(({
  id,focusDown,focusUp,
}) => <TaskItem id={id} focusDown={focusDown} focusUp={focusUp} />)

export default SortableTaskItem
