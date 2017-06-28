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
  // state = { sortCount: 0 }

  // componentWillReceiveProps(nextProps) {
  //   if (!isEqual(this.props.tasks, nextProps.tasks)) {
  //     //TODO: 改进，很多状态的改变不应该forceUpdate
  //   }
  //   this.forceUpdate()
  // }

  forceUpdate() {
    // this.setState({ sortCount: this.state.sortCount + 1 }, () => {
    //   console.log(this.state.sortCount)
    // })
  }

  focusUp = index => {
    const { tasks, history } = this.props
    if (index > 0 && index < tasks.length) {
      const previousId = tasks[index - 1].id
      history.push(`${previousId}`)
      // this.forceUpdate()
    }
  }

  focusDown = index => {
    const { tasks, history } = this.props
    if (index > -1 && index < tasks.length - 1) {
      const nextId = tasks[index + 1].id
      history.push(`${nextId}`)
      // this.forceUpdate()
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
    const { tasks } = this.props
    return (
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
    )
  }

  // render() {
  //   const { allIds, tasks } = this.props
  //   // console.log(tasks);
  //   return (
  //     <table className="TaskTable">
  //       <tbody>
  //         {tasks.map((task, index) => {
  //           // console.log(task);
  //           const IndexInAll = allIds.indexOf(task.id)
  //           return (
  //             <Route
  //               key={index}
  //               render={() =>
  //                 <TaskItem
  //                   task={task}
  //                   index={IndexInAll} //index 是dragItem需要的prop
  //                   focusDown={this.focusDown}
  //                   focusUp={this.focusUp}
  //                 />}
  //             />
  //           )
  //         })}
  //       </tbody>
  //     </table>
  //   )
  // }
}

TaskTable.propTypes = {}

const mapStateToProps = (state, { match }) => {
  return {
    tasks: getTaskByCompleted(state),
    allIds: state.tasks.allIds
  }
}

TaskTable = withRouter(connect(mapStateToProps, { ...actions })(TaskTable))

export default TaskTable
