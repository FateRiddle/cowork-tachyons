import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Route } from 'react-router-dom'
import { SortableContainer } from 'react-sortable-hoc'
import TaskItem from './TaskItem'
import AddItem from './AddItem'
import * as actions from '../../actions'

class TaskTable extends React.Component {

  componentDidMount() {
    console.log(this.props.match.params);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(prevProps.location,this.props.location);
    console.log(this.props.history);
  }

  focusLast = () => {
    const { filteredTasks,history,match } = this.props
    const lastId = filteredTasks[filteredTasks.length-1]
    history.push(`/${match.params.id}/${lastId}`)
  }

  focusUp = index => {
    const { filteredTasks,history,match } = this.props
    if(index > 0 && index < filteredTasks.length){
      const previousId = filteredTasks[index-1]
      history.push(`/${match.params.id}/${previousId}`)
    }
  }

  focusDown = index => {
    const { filteredTasks,history,match } = this.props
    if(index > -1 && index < filteredTasks.length-1){
      const nextId = filteredTasks[index+1]
      history.push(`/${match.params.id}/${nextId}`)
    }
  }

  render() {
    const { filteredTasks,allTasks } = this.props
    console.log(filteredTasks);
    return (
      <div>
        <table className='TaskTable'>
          <tbody>
            {
              filteredTasks
              .map((id,index) => {
                const allIndex = allTasks.indexOf(id)
                return <Route key={id} render={()=>(
                  <TaskItem
                     id={id} index={allIndex} //index 是dragItem需要的prop
                    focusDown={() => this.focusDown(index)}
                    focusUp={() => this.focusUp(index)}
                  />)}
                />
              })
            }
          </tbody>
        </table>
        <AddItem focusLast={this.focusLast} howManyTasks={filteredTasks.length} />
      </div>
    )
  }
}

TaskTable.propTypes = {
  filteredTasks: React.PropTypes.array.isRequired
}

const mapStateToProps = ({ tasks }) => ({
  allTasks: tasks.allIds
})

TaskTable = withRouter(
  connect(
    mapStateToProps,
    {
      ...actions
    }
  )(TaskTable)
)


const SortableTaskTable = SortableContainer(({ filteredTasks }) => <TaskTable filteredTasks={filteredTasks}/>)

export default SortableTaskTable
