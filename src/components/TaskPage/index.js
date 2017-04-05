import React from 'react'
import { connect } from 'react-redux'
import { Switch,Route,Redirect } from 'react-router-dom'
import TableFilter from './TableFilter'
import TaskTable from './TaskTable'
import { changeTaskOrder } from '../../actions'
import { getFilteredTasks } from '../../reducers/index'


class TaskPage extends React.Component {

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.props.changeTaskOrder(oldIndex,newIndex)
  }//拖拽的lib要求的方法

  filterArray = [{
    name:"my tasks",
    filter:{
      users:{name: "Riddle"},
    }
  }]//试验性的结构

  tableWithProps = () => (
    <TaskTable
      filteredTasks={getFilteredTasks(this.props.store)}
      onSortEnd={this.onSortEnd}
      useDragHandle
    />
  )

  render() {
    const { store } = this.props
    return (
      <div className='TaskPage'>
        <TableFilter filterArray={this.filterArray} />
        <Switch>
          <Route exact path='/search/:searchId/list' children={() => this.tableWithProps()}/>
          <Route exact path='/search/:searchId/:taskId' children={() => this.tableWithProps()}/>
          <Route exact path='/:id/list' children={() => this.tableWithProps()}/>
          <Route exact path='/:id/:taskId' children={() => this.tableWithProps()}/>
          <Route render={()=> <div className="WrongUrl">wrong url</div>}/>
        </Switch>
      </div>
    )
  }
}

TaskPage.propTypes = {

}

const mapStateToProps = state => ({
  store:state,
})

TaskPage = connect(mapStateToProps,
  {changeTaskOrder}
)(TaskPage)


export default TaskPage
