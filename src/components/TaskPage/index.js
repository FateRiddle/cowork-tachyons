import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
// import { Switch,Route,Redirect } from 'react-router-dom'
import TableFilter from './TableFilter'
import TaskTable from './TaskTable'
import AddItem from './AddItem'
import { changeTaskOrder } from '../../actions'

class TaskPage extends React.Component {

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.props.changeTaskOrder(oldIndex,newIndex)
  }//拖拽的lib要求的方法

  render() {
    const projectId = this.props.match.params.id
    //如果是search，params里有searchId但没有id（不用projectId是因为assignee，比如my task也使用这个id），search的结果不带<TableFilter />
    return (
      <div className='TaskPage'>
        {projectId && <TableFilter />}
        <TaskTable
          onSortEnd={this.onSortEnd}
          useDragHandle
        />
        <AddItem />
      </div>
    )
  }
}

TaskPage.propTypes = {

}

// const mapStateToProps = state => ({
//   store:state,
// })

TaskPage = withRouter(
  connect(null,
    {changeTaskOrder}
  )(TaskPage)
)


export default TaskPage
