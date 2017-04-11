import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
// import { Switch,Route,Redirect } from 'react-router-dom'
import TableFilter from './TableFilter'
import TaskTable from './TaskTable'
import { changeTaskOrder } from '../../actions'

class TaskPage extends React.Component {

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.props.changeTaskOrder(oldIndex,newIndex)
  }//拖拽的lib要求的方法

  render() {
    return (
      <div className='TaskPage'>
        {this.props.match.params.id === '3' && <TableFilter />}
        <TaskTable
          onSortEnd={this.onSortEnd}
          useDragHandle
        />
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
