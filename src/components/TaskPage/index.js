import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
// import { Switch,Route,Redirect } from 'react-router-dom'
import TableFilter from './TableFilter'
import TaskTable from './TaskTable'
import { changeTaskOrder } from 'actions'

class TaskPage extends React.Component {
  state = { hasMore: false }

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.props.changeTaskOrder(oldIndex, newIndex)
  } //拖拽的lib要求的方法

  onScroll = e => {
    if (e.target.scrollTop > 500) {
      this.loadMore()
    }
  }

  loadMore = () => {}

  render() {
    return (
      <div className="TaskPage">
        <TableFilter />
        <div className="Table__wrapper" onScroll={this.onScroll}>
          {/* <TaskTable onSortEnd={this.onSortEnd} useDragHandle /> */}
          <TaskTable />
        </div>
      </div>
    )
  }
}

TaskPage = withRouter(connect(null, { changeTaskOrder })(TaskPage))

export default TaskPage
