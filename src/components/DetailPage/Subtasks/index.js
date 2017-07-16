import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import { List, AutoSizer } from 'react-virtualized'
import TaskItem from './TaskItem'
import * as actions from 'actions'
import { getSubtasks, getTaskById } from 'reducers'

//转换成可拖拽的item
const SortableItem = SortableElement(TaskItem)

const SortableList = SortableContainer(List)

class Subtasks extends React.Component {
  componentDidMount() {
    this.update()
  }

  componentDidUpdate(prevProps) {
    const { currentTask } = this.props
    const prevTask = prevProps.currentTask
    if (prevTask !== currentTask) {
      this.update()
    }
  }

  update = () => {
    const { updateSubtasks, updateRootTask, currentTask, upTask } = this.props
    // console.log(currentTask, upTask)
    if (currentTask && upTask && upTask.title) {
      //如果任务没有内容，不去刷新是否有子任务，算是唯一能想到减少请求的优化了
      updateSubtasks(currentTask)
      if (upTask.rootTaskId) {
        updateRootTask(currentTask)
      }
    }
  }

  focusUp = index => {
    const { tasks, changeCurrentSubtask } = this.props
    if (index > 0 && index < tasks.length) {
      const previousId = tasks[index - 1].id
      changeCurrentSubtask(previousId)
    }
  }

  focusDown = index => {
    const { tasks, changeCurrentSubtask } = this.props
    if (index > -1 && index < tasks.length - 1) {
      const nextId = tasks[index + 1].id
      changeCurrentSubtask(nextId)
    }
  }

  rowRenderer = props => {
    const { tasks } = this.props
    const { index } = props
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
      let { tasks, changeTaskOrder, allIds } = this.props
      const oldId = tasks[oldIndex].id
      const newId = tasks[newIndex].id
      const _oldIndex = allIds.indexOf(oldId)
      const _newIndex = allIds.indexOf(newId)
      changeTaskOrder(_oldIndex, _newIndex)
      this.forceUpdate()
    }
  }

  render() {
    const { tasks, allIds } = this.props
    console.log(tasks)
    return (
      <div className="h5" data-component="Subtasks">
        <AutoSizer>
          {({ width, height }) =>
            <SortableList
              className="outline-0"
              width={width}
              height={height}
              rowCount={tasks.length}
              rowHeight={30}
              rowRenderer={this.rowRenderer}
              onSortEnd={this.onSortEnd}
              useDragHandle={true}
              allIds={allIds} //for forceUpdate when allIds changes(drag & drop)
              tasks={tasks} // for forceUpdate when tasks changes
            />}
        </AutoSizer>
      </div>
    )
  }
}

const mapStateToProps = (state, { match }) => {
  const currentTask = match.params.taskId
  const { currentSubtask } = state
  return {
    currentTask,
    currentSubtask,
    upTask: getTaskById(state, currentTask),
    tasks: getSubtasks(state),
    allIds: state.tasks.allIds
  }
}

Subtasks = withRouter(connect(mapStateToProps, { ...actions })(Subtasks))

export default Subtasks
