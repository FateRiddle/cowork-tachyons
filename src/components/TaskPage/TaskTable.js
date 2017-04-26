import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Route } from 'react-router-dom'
import { SortableContainer } from 'react-sortable-hoc'
import TaskItem from './TaskItem'
import * as actions from '../../actions'
import { getFilteredTasks } from '../../reducers'

class TaskTable extends React.Component {

  focusUp = id => {
    const { tasks,history } = this.props
    const item = tasks.find(task => task.id === id)
    const index = tasks.indexOf(item)
    if(index > 0 && index < tasks.length){
      const previousId = tasks[index-1].id
      history.push(`${previousId}`)
    }
  }

  focusDown = id => {
    const { tasks,history } = this.props
    const item = tasks.find(task => task.id === id)
    const index = tasks.indexOf(item)
    if(index > -1 && index < tasks.length-1){
      const nextId = tasks[index+1].id
      // console.log(tasks,nextId);
      history.push(`${nextId}`)
    }
  }

  render() {
    const { allIds,tasks } = this.props
    // console.log(tasks);
    return (
        <table className='TaskTable'>
          <tbody>
            {
              tasks
              .map((task,index) => {
                // console.log(task);
                const IndexInAll = allIds.indexOf(task.id)
                return <Route key={index} render={()=>(
                  <TaskItem
                    task={task} index={IndexInAll} //index 是dragItem需要的prop
                    focusDown={this.focusDown}
                    focusUp={this.focusUp}
                  />)}
                />
              })
            }
          </tbody>
        </table>
    )
  }
}

TaskTable.propTypes = {

}

const mapStateToProps = (state,{ match }) => ({
  tasks:getFilteredTasks(state,match.params.id),
  allIds: state.tasks.allIds,
})

TaskTable = withRouter(
  connect(
    mapStateToProps,
    {...actions}
  )(TaskTable)
)

const SortableTaskTable = SortableContainer(() => <TaskTable />)

export default SortableTaskTable
