import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import { List, AutoSizer } from 'react-virtualized'
import TaskItem from './TaskItem'
import * as actions from 'actions'
import { getTaskByCompleted } from 'reducers'
import AddItem from './AddItem'

//转换成可拖拽的item
const SortableItem = SortableElement(TaskItem)

const SortableList = SortableContainer(List)

class TaskTable extends React.Component {
  componentDidMount() {
    const { changeCurrentTask, currentTask } = this.props
    if (currentTask) {
      changeCurrentTask(currentTask)
    }
  }

  focusUp = index => {
    const { tasks, history, changeCurrentTask } = this.props
    if (index > 0 && index < tasks.length) {
      const previousId = tasks[index - 1].id
      history.push(`${previousId}`)
      changeCurrentTask(previousId)
    }
  }

  focusDown = index => {
    const { tasks, history, changeCurrentTask } = this.props
    if (index > -1 && index < tasks.length - 1) {
      const nextId = tasks[index + 1].id
      history.push(`${nextId}`)
      changeCurrentTask(nextId)
    }
  }

  rowRenderer = props => {
    const { tasks } = this.props
    const { index } = props
    if (index === tasks.length) {
      return <AddItem {...props} />
    }
    return (
      <SortableItem
        task={tasks[index]}
        focusUp={this.focusUp}
        focusDown={this.focusDown}
        taskIndex={index}
        {...props}
      />
    )
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      //转换成全部任务中对应的index（显示的部分可能是未完成任务，对应的index不是在整个allIds里的index）
      let {
        tasks,
        changeMyOrder,
        changeTaskOrder,
        allIds,
        match,
        me
      } = this.props
      const isMe = match.params.id === me.id
      const oldId = tasks[oldIndex].id
      const newId = tasks[newIndex].id
      const _oldIndex = allIds.indexOf(oldId)
      const _newIndex = allIds.indexOf(newId)
      if (isMe) {
        changeMyOrder(_oldIndex, _newIndex)
      } else {
        changeTaskOrder(_oldIndex, _newIndex)
      }
      this.forceUpdate()
    }
  }

  render() {
    const { tasks } = this.props
    return (
      <div className="Table__wrapper">
        <AutoSizer>
          {({ height, width }) =>
            <SortableList
              className="TaskTable"
              width={width}
              height={height}
              rowCount={tasks.length + 1}
              rowHeight={30}
              rowRenderer={this.rowRenderer}
              onSortEnd={this.onSortEnd}
              useDragHandle={true}
              allIds={this.props.allIds} //for forceUpdate when allIds changes(drag & drop)
              tasks={tasks} // for forceUpdate when tasks changes
            />}
        </AutoSizer>
      </div>
    )
  }
}

TaskTable.propTypes = {}

const mapStateToProps = (state, { match }) => {
  let tasks = getTaskByCompleted(state)
  const { id } = match.params
  if (id === state.me.id) {
    //个人任务, 排除未分配给自己的任务、子任务
    tasks = tasks.filter(t => t.assignee === match.params.id)
  } else if (id && id !== 'search') {
    //项目任务，排除所有子任务
    tasks = tasks.filter(t => t.projectId === id).filter(t => !t.upTaskId)
  }

  return {
    tasks,
    allIds: state.tasks.allIds,
    currentTask: match.params.taskId,
    match,
    me: state.me
  }
}

TaskTable = withRouter(connect(mapStateToProps, { ...actions })(TaskTable))

export default TaskTable
